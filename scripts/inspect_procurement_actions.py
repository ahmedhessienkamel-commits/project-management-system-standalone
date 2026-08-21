from pathlib import Path
text = Path('/home/ubuntu/meta-ads-command-center/client/src/pages/Operations.tsx').read_text()
for needle in ['DocumentActions title={`طلب مواد', 'DocumentActions title={`أمر شراء']:
    print(needle, text.count(needle))
    start = 0
    while True:
        index = text.find(needle, start)
        if index < 0:
            break
        print('INDEX', index, text[max(0,index-120):index+260])
        start = index + 1
