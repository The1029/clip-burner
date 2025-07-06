import fs from 'fs';
import kindleClipping from 'kindle-clipping';
import { select } from '@inquirer/prompts';
import clipboard from 'clipboardy';

const string = fs.readFileSync('./My Clippings.txt', 'utf8');
const clippings = kindleClipping.clippingParser(string);
if (!clippings) throw new Error('Could not parse clippings');
console.log(clippings[0]);
let bookNames = [];

for (const clip of clippings) {
  if (bookNames.includes(clip.bookName)) continue;
  bookNames = [...bookNames, clip.bookName];
}

const answer = await select({
  message: 'Which book?',
  choices: bookNames
});

console.log(`Selected '${answer}'`);

let bookClips = [];
let fullString = '';
for (const clip of clippings) {
  if (clip.bookName === answer && clip.type === 'Highlight') {

    const clipString = `>${clip.content}\n>— [Location::${clip.location}]\n\n`;

    if (bookClips.includes(clipString)) continue;

    bookClips = [...bookClips, clipString];
    fullString += clipString;
  }
}

console.log(`Found ${bookClips.length} clippings.`);

const action = await select({
  message: 'Where to put?',
  choices: ['Clipboard', 'File']
});

if (action === 'Clipboard') {
  clipboard.writeSync(fullString);
  console.log(`Successfully copied to clipboard!`);
  console.log('Go you!');
} else if (action === 'File') {
  fs.writeFileSync(`./Clips/${answer}.md`, fullString, err => {
    if (err) console.error(err);
  });
  console.log(`Successfully written to ${answer}.md!`);
  console.log('Go you!');
} else {
  console.error('Invalid choice...');
}






