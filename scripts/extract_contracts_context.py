from pathlib import Path
s = Path('/home/ubuntu/meta-ads-command-center/client/src/pages/Operations.tsx').read_text()
key = 'tab === "certificates"'
i = s.find(key)
print('index', i)
print(s[max(0, i-1800):i+3000])
