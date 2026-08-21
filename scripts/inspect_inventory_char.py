from pathlib import Path
text = Path('/home/ubuntu/meta-ads-command-center/client/src/pages/Inventory.tsx').read_text()
line = text.splitlines()[49]
for index in range(max(0, 1520), min(len(line), 1545)):
    print(index, repr(line[index]), ord(line[index]))
