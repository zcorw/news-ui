type blockType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "paragraph";
type contentType = "tag" | "text" | "highlight";
const blockTypes: blockType[] = ["h1", "h2", "h3", "h4", "h5", "h6", "paragraph"];
const contentTypes: contentType[] = ["tag", "text", "highlight"];

class State {
  src: string;
  pos: number;
  nodes: Block[];
  constructor(src: string) {
    this.src = src;
    this.pos = 0;
    this.nodes = [];
  }
  get max() {
    return this.src.length;
  }
  push(type: blockType, mark: string) {
    const node: Block = {
      type,
      mark,
      src: "",
      children: [],
    }
    this.nodes.push(node);
    return node;
  }
  isEnd(pos?: number) {
    if (pos === undefined) {
      pos = this.pos;
    }
    return pos >= this.max;
  }
}

interface Block {
  type: blockType;
  mark: string;
  src: string;
  children: Content[];
}

interface Content {
  type: contentType;
  text: string;
  src: string;
}

declare function checkBlock(state: State): Block | false;
declare function checkContent(state: State): Content | false;

const checkHeading: typeof checkBlock = (state) => {
  let pos = state.pos;
  let level = 1;
  if (state.src[pos] !== '#') return false;
  let char = state.src[++pos];
  while (!state.isEnd(pos) && char === '#'&& level <= 6) {
    level++;
    char = state.src[++pos];
  }
  if (char !== ' ') return false;
  while (char === ' ') {
    char = state.src[++pos];
  }
  const typeName = `h${level}`
  const block = state.push(<blockType>typeName, '######'.slice(0, level));
  state.pos = pos;
  return block;
}

type simpleState = {
  src: string;
  pos: number;
}

function escape(state: simpleState): { text: string, pos: number} {
  let pos = state.pos;
  let char = state.src[pos];
  if (state.src.length > pos && char === '\\') {
    const _c = state.src[++pos];
    if ('`\\#'.indexOf(_c) !== -1) {
      char = _c;
    }
  }
  return {
    text: char,
    pos,
  };
}

function isNewline(state: simpleState): Boolean {
  let pos = state.pos;
  let char = state.src[pos];
  return char === '\n';
}

function isPass(state: simpleState): Boolean {
  let pos = state.pos;
  let char = state.src[pos];
  return char === '\s'
}

interface checkOption {
  type: contentType;
  start: string | RegExp;
  end: string | RegExp;
  matches: (text: string) => boolean;
  getSrc: (state: State, endPos: number) => string; 
}

function _check(state: State, option: checkOption) {
  const max = 50;
  let simpleState = { src: state.src, pos: state.pos };
  let text = "";
  if (state.src[simpleState.pos] !== option.start) return false;
  function checkEnd(text: string) {
    if (typeof option.end === 'string') {
      return text === option.end;
    } else {
      return option.end.test(text);
    }
  }
  simpleState.pos++;
  while(
    !state.isEnd(simpleState.pos) &&
    simpleState.pos - state.pos < max &&
    !checkEnd(state.src[simpleState.pos]) &&
    !isNewline(simpleState)
  ) {
    if (isPass(simpleState)) {
      simpleState.pos++;
      continue;
    }
    const { text: char, pos } = escape(simpleState);
    text += char;
    simpleState.pos = pos + 1;
  }
  const src = option.getSrc(state, simpleState.pos);
  if (!option.matches(src)) {
    return false;
  }
  const content: Content = {
    type: option.type,
    text,
    src,
  }
  return content;
}

const checkTag: typeof checkContent = (state) => {
  const content = _check(state, {
    type: 'tag',
    start: '#',
    end: /\s/,
    matches: (text) => /#[^\s#][^#]+/.test(text),
    getSrc: (state, endPos) => state.src.slice(state.pos, endPos),
  });
  if (!content) return false;
  state.pos = state.pos + content.src.length;
  return content;
}

const checkHighlight: typeof checkContent = (state) => {
  const content = _check(state, {
    type: 'highlight',
    start: '`',
    end: '`',
    matches: (text) => /`[^`]+`/.test(text),
    getSrc: (state, endPos) => state.src.slice(state.pos, endPos + 1),
  });
  if (!content) return false;
  state.pos = state.pos + content.src.length + 1;
  return content;
}

const blockRules: typeof checkBlock[] = [
  checkHeading
];
const contentRules: typeof checkContent[] = [
  checkTag,
  checkHighlight,
]


function newBlock(state: State) {
  let block: Block | false = false;
  const startPos = state.pos;
  for (let i = 0; blockRules.length > i; i++) {
    block = blockRules[i](state);
    if (block) break;
  }
  if (!block) {
    block = state.push('paragraph', '');
  }
  let presumed = {
    text: "",
    startPos: state.pos,
    endPos: state.pos,
  };
  while (!state.isEnd() && !isNewline(state)) {
    let content: Content | false = false;
    for (let i = 0; contentRules.length > i; i++) {
      content = contentRules[i](state);
      if (content) break;
    }
    if (!content) {
      const { text: char, pos } = escape({
        src: state.src,
        pos: state.pos,
      });   
      presumed.text += char;
      presumed.endPos = pos + 1;
      state.pos = pos + 1;
    } else {
      if (presumed.text) {
        block.children.push({
          type: 'text',
          text: presumed.text,
          src: state.src.slice(presumed.startPos, presumed.endPos),
        })
      }
      block.children.push(content);
      presumed = {
        text: "",
        startPos: state.pos,
        endPos: state.pos,
      };
    }
  }
  if (presumed.text) {
    block.children.push({
      type: 'text',
      text: presumed.text,
      src: state.src.slice(presumed.startPos, presumed.endPos),
    })
  }
  block.src = state.src.slice(startPos, state.pos);
  state.pos++;
}

export default function parser(markdown: string) {
  const state = new State(markdown);
  while(!state.isEnd()) {
    newBlock(state);
  }
  return state.nodes;
}