"""Read public site pages and save a reproducible migration inventory (stdlib only)."""
import concurrent.futures
import datetime
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlunsplit
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://www.airturbulencia.com/'

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.images, self.forms, self.headings = [], [], [], []
        self.title, self.description, self.canonical = '', '', ''
        self.capture = None
        self.buffer = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'a' and a.get('href'):
            self.links.append(a['href'])
        if tag == 'img':
            self.images.append(a)
        if tag == 'form':
            self.forms.append(a)
        if tag == 'meta' and a.get('name', '').lower() == 'description':
            self.description = a.get('content', '')
        if tag == 'link' and a.get('rel') == 'canonical':
            self.canonical = a.get('href', '')
        if tag in ('title', 'h1', 'h2'):
            self.capture, self.buffer = tag, []

    def handle_data(self, data):
        if self.capture:
            self.buffer.append(data)

    def handle_endtag(self, tag):
        if tag == self.capture:
            value = ' '.join(' '.join(self.buffer).split())
            if tag == 'title':
                self.title = value
            else:
                self.headings.append({'level': tag, 'text': value})
            self.capture = None

def fetch(url):
    try:
        with urlopen(Request(url, headers={'User-Agent': 'AirTurbulenciaRedesignInventory/1.0'}), timeout=25) as r:
            body = r.read().decode('utf-8', errors='replace')
            return {'url': url, 'final_url': r.url, 'status': r.status, 'body': body}
    except Exception as exc:
        return {'url': url, 'error': str(exc)}

def internal_page(href, base=BASE):
    p = urlsplit(urljoin(base, href))
    if p.scheme not in ('http', 'https') or p.netloc != urlsplit(BASE).netloc:
        return None
    if Path(p.path).suffix and not p.path.endswith('.html'):
        return None
    return urlunsplit(('https', p.netloc, p.path or '/', '', ''))

def main():
    pending, visited, pages, maps = {BASE}, set(), [], []
    snapshot = ROOT / 'docs/evidence/source-baseline'
    snapshot.mkdir(parents=True, exist_ok=True)
    for path in ('robots.txt', 'sitemap.xml', 'sitemap-index.xml'):
        result = fetch(urljoin(BASE, path))
        if 'body' in result:
            (snapshot / path).write_text(result['body'], encoding='utf-8')
        maps.append({k: v for k, v in result.items() if k != 'body'})
        if 'body' in result and path.endswith('.xml'):
            try:
                tree = ET.fromstring(result['body'])
                locs = [n.text for n in tree.iter() if n.tag.endswith('}loc')]
                for loc in locs:
                    if loc.endswith('.xml') and urlsplit(loc).netloc == urlsplit(BASE).netloc:
                        sub = fetch(loc)
                        if 'body' in sub:
                            (snapshot / Path(urlsplit(loc).path).name).write_text(sub['body'], encoding='utf-8')
                        maps.append({k: v for k, v in sub.items() if k != 'body'})
                        if 'body' in sub:
                            locs2 = [n.text for n in ET.fromstring(sub['body']).iter() if n.tag.endswith('}loc')]
                            pending.update(filter(None, (internal_page(v) for v in locs2)))
                    else:
                        page = internal_page(loc)
                        if page:
                            pending.add(page)
            except ET.ParseError:
                pass
    while pending and len(visited) < 100:
        batch = sorted(pending - visited)[:100 - len(visited)]
        pending.clear()
        if not batch:
            break
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
            results = list(pool.map(fetch, batch))
        for result in results:
            visited.add(result['url'])
            body = result.pop('body', None)
            if body is not None:
                slug = urlsplit(result['url']).path.strip('/').replace('/', '__') or 'index'
                (snapshot / f'{slug}.html').write_text(body, encoding='utf-8')
                p = Page()
                p.feed(body)
                result.update(title=p.title, description=p.description, canonical=p.canonical,
                              headings=p.headings, images=p.images, forms=p.forms,
                              links=sorted(set(p.links)))
                pending.update(v for href in p.links if (v := internal_page(href, result['final_url'])) and v not in visited)
            pages.append(result)
    output = ROOT / 'docs/evidence/site-inventory.json'
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps({'captured_at_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
                                 'source': BASE, 'discovery': maps, 'pages': sorted(pages, key=lambda p: p['url']),
                                 'remaining': sorted(pending - visited)}, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Saved {len(pages)} pages to {output}')
    for page in sorted(pages, key=lambda p: p['url']):
        print(page.get('status', 'ERROR'), urlsplit(page['url']).path, page.get('title', page.get('error', '')))

if __name__ == '__main__':
    main()
