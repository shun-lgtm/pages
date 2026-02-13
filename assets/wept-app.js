//ダブルエンコード問題、本番環境いれる時に直す
/* global React, ReactDOM */
const { useState, useEffect, useRef } = React;

// å£è‡­ãƒã‚§ãƒƒã‚¯è³ªå•ãƒ‡ãƒ¼ã‚¿
const BREATH_QUESTIONS = [
  { id: 'q1', question: 'å£è‡­ã®ã‚¿ã‚¤ãƒ—ã¯ï¼Ÿ', options: [
    { value: 'A', label: 'è…æ•—è‡­ï¼ˆç”Ÿã‚´ãƒŸã£ã½ã„ï¼‰' },
    { value: 'B', label: 'ã‚¢ãƒ³ãƒ¢ãƒ‹ã‚¢ãƒ»å°¿ã£ã½ã„' },
    { value: 'C', label: 'é…¸ã£ã±ã„' },
    { value: 'D', label: 'ã†ã‚“ã¡ã£ã½ã„' }
  ]},
  { id: 'q2', question: 'ãã£ãŸã‚Šã—ã¦ã„ã¾ã™ã‹ï¼Ÿ', options: [{ value: 'yes', label: 'ã¯ã„' }, { value: 'no', label: 'ã„ã„ãˆ' }] },
  { id: 'q3', question: 'å˜”åã¯ã‚ã‚Šã¾ã™ã‹ï¼Ÿ', options: [{ value: 'yes', label: 'ã¯ã„' }, { value: 'no', label: 'ã„ã„ãˆ' }] },
  { id: 'q4', question: 'ä¸‹ç—¢ã¯ã‚ã‚Šã¾ã™ã‹ï¼Ÿ', options: [{ value: 'yes', label: 'ã¯ã„' }, { value: 'no', label: 'ã„ã„ãˆ' }] },
  { id: 'q5', question: 'ä¾¿é€šãŒãªã„çŠ¶æ…‹ã§ã™ã‹ï¼Ÿ', options: [{ value: 'yes', label: 'ã¯ã„' }, { value: 'no', label: 'ã„ã„ãˆ' }] },
  { id: 'q6', question: 'æ°´ã‚’ãŸãã•ã‚“é£²ã‚€ãƒ»ãŠã—ã£ã“ãŒå¤šã„ã§ã™ã‹ï¼Ÿ', options: [{ value: 'yes', label: 'ã¯ã„' }, { value: 'no', label: 'ã„ã„ãˆ' }] },
  { id: 'q7', question: 'å£ã‚’ç—›ãŒã‚‹æ§˜å­ãŒã‚ã‚Šã¾ã™ã‹ï¼Ÿ', options: [{ value: 'yes', label: 'ã¯ã„' }, { value: 'no', label: 'ã„ã„ãˆ' }] }
];

// å£è‡­ãƒã‚§ãƒƒã‚¯çµæžœè¾žæ›¸
const BREATH_CONTENT = {
  A: {
    title: 'è…æ•—è‡­ï¼ˆæ­¯å‘¨ç³»ï¼‰',
    comment: 'è…æ•—è‡­ã¯ã€å£ã®ä¸­ã®ç‚Žç—‡ï¼ˆæ­¯å‘¨ãƒˆãƒ©ãƒ–ãƒ«ï¼‰ãŒé–¢ä¿‚ã—ã¦ã„ã‚‹ã“ã¨ãŒã‚ã‚Šã¾ã™ã€‚é€²è¡Œã™ã‚‹ã¨ã¤ã‚‰ã•ãŒå¢—ãˆã‚„ã™ã„ã®ã§ã€ã§ãã‚‹ã ã‘æ—©ã‚ã«çŠ¶æ…‹ã‚’ç¢ºèªã—ã¦ã‚ã’ã¦ãã ã•ã„ã€‚',
    tips: ['æ­¯ããã®èµ¤ã¿ãƒ»å‡ºè¡€ã€æ­¯çŸ³ã®ä»˜ãæ–¹ã‚’ä¸€åº¦ã ã‘ç¢ºèªã—ã¦ã¿ã¦ãã ã•ã„ã€‚', 'å£ã‚’è§¦ã‚‰ã‚Œã‚‹ã®ã‚’å«ŒãŒã‚‹ï¼ç‰‡å´ã§å™›ã‚€æ§˜å­ãŒã‚ã‚Œã°ã€ç„¡ç†ã«å£ã‚’é–‹ã‘ã‚ˆã†ã¨ã—ãªãã¦å¤§ä¸ˆå¤«ã§ã™ã€‚'],
    articles: [{ url: 'https://kinswith-vet.com/journal/1234/', title: 'æ­¯å‘¨ç—…ã®è§£èª¬' }, { url: 'https://kinswith-vet.com/journal/2810/', title: 'æ­¯å‘¨ç—…ã®ç—‡ä¾‹' }, { url: 'https://kinswith-vet.com/journal/868/', title: 'å£è‡­ã¾ã¨ã‚' }]
  },
  B: {
    title: 'ã‚¢ãƒ³ãƒ¢ãƒ‹ã‚¢è‡­ï¼ˆå…¨èº«ç³»ï¼‰',
    comment: 'ã‚¢ãƒ³ãƒ¢ãƒ‹ã‚¢è‡­ã¯ã€ãŠå£ã ã‘ã§ãªãä½“ã®çŠ¶æ…‹ï¼ˆè…Žè‡“ãªã©ï¼‰ãŒé–¢ä¿‚ã™ã‚‹å¯èƒ½æ€§ãŒã‚ã‚Šã¾ã™ã€‚ç¶šãå ´åˆã¯"å¿µã®ãŸã‚"ã®ç¢ºèªãŒå®‰å¿ƒã«ã¤ãªãŒã‚Šã¾ã™ã€‚',
    tips: ['å£ã®ä¸­ã ã‘ã§ãªãã€å…ƒæ°—ãƒ»é£Ÿæ¬²ãƒ»æ°´ã‚’é£²ã‚€é‡ã®å¤‰åŒ–ãŒãªã„ã‹ã‚’ä¸€ç·’ã«è¦‹ã¦ãã ã•ã„ã€‚', 'ã‚‚ã—å˜”åã‚„ä¸‹ç—¢ã€ãã£ãŸã‚ŠãŒé‡ãªã‚‹å ´åˆã¯ã€å£è‡­ã‚ˆã‚Š"ä½“èª¿ã®å¤‰åŒ–"ã‚’å„ªå…ˆã—ã¦è€ƒãˆã‚‹ã®ãŒå®‰å¿ƒã§ã™ã€‚'],
    articles: [{ url: 'https://kinswith-vet.com/journal/1044/', title: 'è…Žä¸å…¨ã®è§£èª¬' }, { url: 'https://kinswith-vet.com/journal/3409/', title: 'æŠœæ­¯ç—‡ä¾‹' }, { url: 'https://kinswith-vet.com/journal/868/', title: 'å£è‡­ã¾ã¨ã‚' }]
  },
  C: {
    title: 'é…¸ã£ã±ã„è‡­ã„ï¼ˆèƒƒè…¸ç³»ï¼‰',
    comment: 'é…¸ã£ã±ã„å£è‡­ã¯ã€èƒƒè…¸ã®ä¸èª¿ã§èµ·ã“ã‚‹ã“ã¨ãŒã‚ã‚Šã¾ã™ã€‚å˜”åã‚„ä¸‹ç—¢ãŒé‡ãªã‚‹ã¨æ€¥ãŽåº¦ãŒä¸ŠãŒã‚‹ã®ã§ã€æ§˜å­ã‚’ã‚ˆãè¦‹ã¦ã‚ã’ã¦ãã ã•ã„ã€‚',
    tips: ['ç›´è¿‘ã§åã„ãŸï¼ä¸‹ç—¢ãŒã‚ã‚‹ï¼é£Ÿå¾Œã«æ°—æŒã¡æ‚ªãã†ã€ãªã©ãŒã‚ã‚Œã°ãƒ¡ãƒ¢ã—ã¦ãŠãã¨ç›¸è«‡ãŒã‚¹ãƒ ãƒ¼ã‚ºã§ã™ã€‚', 'æ€¥ã«æ‚ªåŒ–ã™ã‚‹æ™‚ã‚‚ã‚ã‚‹ã®ã§ã€å›žæ•°ãŒå¢—ãˆã‚‹ãƒ»å…ƒæ°—ãŒè½ã¡ã‚‹å ´åˆã¯æ—©ã‚ã«åˆ‡ã‚Šæ›¿ãˆã¦ãã ã•ã„ã€‚'],
    articles: [{ url: 'https://kinswith-vet.com/journal/3415/', title: 'æ€¥æ€§èƒƒè…¸ç‚Žã®ç—‡ä¾‹' }, { url: 'https://kinswith-vet.com/journal/774/', title: 'ä¸‹ç—¢ã®åŽŸå› ã¨å¯¾å‡¦' }, { url: 'https://kinswith-vet.com/journal/868/', title: 'å£è‡­ã¾ã¨ã‚' }]
  },
  D: {
    title: 'ä¾¿è‡­ï¼ˆæ¶ˆåŒ–å™¨ç³»ï¼‰',
    comment: 'ä¾¿ã®ã‚ˆã†ãªã«ãŠã„ã¯ã€æ¶ˆåŒ–å™¨ã®ä¸èª¿ãŒé‡ãªã£ã¦ã„ã‚‹ã‚µã‚¤ãƒ³ã¨ã—ã¦æ‰±ã†ã®ãŒå®‰å…¨ã§ã™ã€‚å˜”åã‚„ä¸‹ç—¢ã€ä¾¿é€šã®å¤‰åŒ–ãŒä¸€ç·’ã«ã‚ã‚‹æ™‚ã¯æ—©ã‚ã«ç›¸è«‡ã§ãã‚‹ã¨å®‰å¿ƒã§ã™ã€‚',
    tips: ['ä¾¿è‡­ã£ã½ã„æ™‚ã¯ã€å˜”åãƒ»ä¸‹ç—¢ãƒ»ä¾¿é€šã®æœ‰ç„¡ã‚’ã‚»ãƒƒãƒˆã§è¦‹ã‚‹ã®ãŒå¤§äº‹ã§ã™ã€‚', '"ä¾¿ãŒå‡ºãªã„ï¼‹å˜”å"ã®çµ„ã¿åˆã‚ã›ã¯è² æ‹…ãŒå¤§ãããªã‚Šã‚„ã™ã„ã®ã§ã€ç„¡ç†ã«æ§˜å­è¦‹ã—ãªãã¦å¤§ä¸ˆå¤«ã§ã™ã€‚'],
    articles: [{ url: 'https://kinswith-vet.com/journal/3759/', title: 'PLEï¼‹èƒƒå†…ç•°ç‰©ã®ç—‡ä¾‹' }, { url: 'https://kinswith-vet.com/journal/3415/', title: 'æ€¥æ€§èƒƒè…¸ç‚Žã®ç—‡ä¾‹' }, { url: 'https://kinswith-vet.com/journal/868/', title: 'å£è‡­ã¾ã¨ã‚' }]
  }
};

// æ­¯ç§‘æ²»ç™‚LP
const DENTAL_LP_PAGES = [
  { id: 1, type: 'hero', topLine: 'å¹´é–“400ä»¶ä»¥ä¸Šã®æ­¯ç§‘æ‰‹è¡“ã‚’å®Ÿæ–½', title: 'ãªã‚‹ã¹ãæ­¯ã‚’æŠœã‹ãªã„æ­¯å‘¨æ²»ç™‚', subtitle: 'å½“é™¢ã§ã¯ã€ã€Œã§ãã‚‹ã ã‘æ­¯ã‚’æŠœã‹ãªã„ã€ã“ã¨ã‚’å¤§å‰æã¨ã—ã€å¹…åºƒã„æ­¯ç§‘ã‚±ã‚¢ã‚’è¡Œãªã£ã¦ã„ã¾ã™', tags: ['æ­¯å‘¨ç—…', 'æ­¯ãŒæŠ˜ã‚ŒãŸ', 'æ­¯çŸ³å–ã‚Š', 'å£å†…ç‚Ž', 'æ­¯å‘¨å¤–ç§‘', 'å†ç”Ÿç™‚æ³•', 'æ­¯ç£¨ãã‚±ã‚¢ãƒ»äºˆé˜²'] },
  { id: 2, type: 'why', title: 'æ­¯ã‚’æ®‹ã›ã‚‹ã®ã«ã¯ç†ç”±ãŒã‚ã‚Šã¾ã™', columns: [{ label: 'WHY.01', title: 'å®Ÿç¸¾ã¨é«˜é›£åº¦å¯¾å¿œ', desc: 'å†ç”Ÿç™‚æ³•ãƒ»æ ¹ç®¡æ²»ç™‚ãªã©' }, { label: 'WHY.02', title: 'ç²¾å¯†è¨­å‚™', desc: 'ãƒžã‚¤ã‚¯ãƒ­ã‚¹ã‚³ãƒ¼ãƒ—ãƒ»æ­¯ç§‘ãƒ¬ãƒ³ãƒˆã‚²ãƒ³' }, { label: 'WHY.03', title: 'æ­¯ç§‘ç‰¹åŒ–ã®ç£åŒ»å¸«', desc: 'ç ”é‘½ãƒ»å‹‰å¼·ä¼šã¸ã®å‚åŠ ' }], conclusion: 'è¨ºæ–­ã®ç²¾åº¦ã¨æ²»ç™‚ã®ç²¾åº¦ã‚’ä¸¡è¼ªã§ä¸Šã’ã¦ã„ã¾ã™' },
  { id: 3, type: 'cases', title: '[æ­¯å‘¨ç—…] Before / After', cases: [
    { desc: '10æ‰ã®å°åž‹çŠ¬ã®é‡åº¦æ­¯å‘¨ç‚Žã¨ç ´æŠ˜ | äºŒå­çŽ‰å·é™¢', url: 'https://kinswith-vet.com/journal/3003/', urlLabel: 'ã“ã®ç—‡ä¾‹ã®è¨˜äº‹ã‚’èª­ã‚€' },
    { desc: '7æ‰ä¸­åž‹çŠ¬ã®æ­¯å‘¨æ²»ç™‚', url: 'https://kinswith-vet.com/journal/2810/', urlLabel: 'ã“ã®ç—‡ä¾‹ã®è¨˜äº‹ã‚’èª­ã‚€' },
  ], note: 'â€»çŠ¶æ…‹ã«ã‚ˆã‚Šæ²»ç™‚å†…å®¹ã¯ç•°ãªã‚Šã¾ã™' },
  { id: 4, type: 'cases', title: '[ç ´æŠ˜(æ­¯ãŒæŠ˜ã‚ŒãŸ)] Before / After', cases: [
    { desc: 'æ­¯ã®ç ´æŠ˜ã«å¯¾ã—æŠœæ­¯ã‚’è¡Œã‚ãšã«æ²»ç™‚', url: 'https://kinswith-vet.com/journal/1703/', urlLabel: 'ã“ã®ç—‡ä¾‹ã®è¨˜äº‹ã‚’èª­ã‚€' },
    { desc: '5æ‰å°åž‹çŠ¬ã®çŠ¬æ­¯æŠœé«„æ ¹ç®¡æ²»ç™‚', url: 'https://kinswith-vet.com/journal/2769/', urlLabel: 'ã“ã®ç—‡ä¾‹ã®è¨˜äº‹ã‚’èª­ã‚€' },
  ], note: 'â€»çŠ¶æ…‹ã«ã‚ˆã‚Šæ²»ç™‚å†…å®¹ã¯ç•°ãªã‚Šã¾ã™' },
  { id: 5, type: 'equipment', title: 'è¦‹ãˆã‚‹ã‹ã‚‰ã€å®ˆã‚Œã‚‹', subtitle: 'é¡•å¾®é¡æ­¯ç§‘ï¼ˆãƒžã‚¤ã‚¯ãƒ­ã‚¹ã‚³ãƒ¼ãƒ—ï¼‰', points: ['è¦‹è½ã¨ã—ã‚’æ¸›ã‚‰ã—ã€ç²¾åº¦ãŒä¸ŠãŒã‚‹', 'å¿…è¦ãªå‡¦ç½®ã‚’çµžã‚Œã¦ã€è² æ‹…ã‚’æ¸›ã‚‰ã—ã‚„ã™ã„', 'æ–½è¡“ã®ç¢ºå®Ÿæ€§ãŒä¸ŠãŒã‚Šã€æ²»ç™‚ã®è³ªãŒå®‰å®š'], note: 'å°Žå…¥æ–½è¨­ãŒå°‘ãªã„è¨­å‚™ã§ã™' },
  { id: 6, type: 'equipment', title: 'æ®‹ã›ã‚‹ã‹ã©ã†ã‹ã¯ã€æ ¹ã£ã“ã§æ±ºã¾ã‚‹ã“ã¨ãŒã‚ã‚Šã¾ã™', subtitle: 'æ­¯ç§‘å°‚ç”¨ãƒ¬ãƒ³ãƒˆã‚²ãƒ³', points: ['æ­¯ç§‘ãƒ¬ãƒ³ãƒˆã‚²ãƒ³ã¯æ­¯1æœ¬å˜ä½ã§è©•ä¾¡ã§ãã‚‹', 'ã€Œæ®‹ã™ã¹ãæ­¯ã€ã€ŒæŠœãã¹ãæ­¯ã€ã‚’è¦‹æ¥µã‚ã‚‹ææ–™ã«ãªã‚‹', 'æŠœæ­¯ã¯ä¸å¯é€†ã ã‹ã‚‰ã“ãã€åˆ¤æ–­ã®ç²¾åº¦ãŒå¤§äº‹'], note: 'â€»æ®‹ã™ã“ã¨ãŒæœ€å–„ã¨ã¯é™ã‚‰ãªã„ã‚±ãƒ¼ã‚¹ã‚‚ã‚ã‚Šã¾ã™' },
  { id: 7, type: 'doctor', title: 'æ­¯ç§‘ã‚’æ‹…å½“ã™ã‚‹ç£åŒ»å¸«', profile: { name: 'å²¡ç”° ç´”ä¸€', role: 'é™¢é•·', affiliation: 'æ—¥æœ¬ç£åŒ»æ­¯ç§‘å­¦ä¼š æ‰€å±ž', stance: 'ãªã‚‹ã¹ãæ­¯ã‚’æ®‹ã™ãŸã‚ã«ã€çŠ¶æ…‹ã‚’è¦‹æ¥µã‚ãŸè¨ºç™‚ã‚’å¿ƒãŒã‘ã¦ã„ã¾ã™' }, points: ['è¡“å‰æ¤œæŸ»ã‚’å«ã‚ã€çŠ¶æ…‹ã‚’è¦‹ã¦åˆ¤æ–­ã™ã‚‹', 'æ²»ç™‚å¾Œã®ã‚±ã‚¢ã¾ã§ä¼´èµ°ã™ã‚‹'] },
  { id: 8, type: 'voices', title: 'é£¼ã„ä¸»ã•ã‚“ã®å£°', voices: [{ text: 'å£è‡­ãŒãšã£ã¨æ°—ã«ãªã£ã¦ã„ã¾ã—ãŸãŒã€æ²»ç™‚å¾Œã¯é©šãã»ã©æ”¹å–„ã—ã¾ã—ãŸã€‚', tag: 'å£è‡­ã®æ‚©ã¿' }, { text: 'éº»é…”ãŒä¸å®‰ã§ã—ãŸãŒã€äº‹å‰ã®èª¬æ˜ŽãŒä¸å¯§ã§å®‰å¿ƒã§ãã¾ã—ãŸã€‚', tag: 'éº»é…”ã¸ã®ä¸å®‰' }], conclusion: 'åŒã˜æ‚©ã¿ã§ã‚‚ã€ã¾ãšã¯çŠ¶æ³æ•´ç†ã‹ã‚‰ã§å¤§ä¸ˆå¤«ã§ã™' }
];

// æ²»ç™‚ã®æµã‚ŒLP
const FLOW_LP_PAGES = [
  { id: 1, step: 'äºˆç´„', title: 'WEBã¾ãŸã¯é›»è©±ã§ã”äºˆç´„', body: 'WEBã¾ãŸã¯é›»è©±ã‹ã‚‰ã”äºˆç´„ã‚’ãŠå–ã‚Šãã ã•ã„ã€‚\nã€Œã¾ãšç›¸è«‡ã ã‘ã€ã§ã‚‚å¤§ä¸ˆå¤«ã§ã™ã€‚', note: 'æ··é›‘çŠ¶æ³ã«ã‚ˆã‚Šã”æ¡ˆå†…æ™‚é–“ãŒå‰å¾Œã™ã‚‹å ´åˆãŒã‚ã‚Šã¾ã™ã€‚', flowType: 'main' },
  { id: 2, step: 'åˆè¨º', title: 'å•è¨ºã¨ãŠå£ã®ç¢ºèª', body: 'å•è¨ºç¥¨ã®å›žç­”ãŒã”ã–ã„ã¾ã™ã®ã§ã€äºˆç´„æ™‚é–“ã®10åˆ†å‰ã«ã”æ¥é™¢ã„ãŸã ãã¨ã‚¹ãƒ ãƒ¼ã‚ºã§ã™ã€‚', note: 'ç„¡ç†ã«å£ã‚’é–‹ã‘ã‚‹å¿…è¦ã¯ã‚ã‚Šã¾ã›ã‚“ã€‚', flowType: 'main' },
  { id: 3, step: 'æ¤œæŸ»', title: 'å¿…è¦ã«å¿œã˜ã¦æ¤œæŸ»ã§çŠ¶æ…‹ã‚’æŠŠæ¡', body: 'è¡€æ¶²æ¤œæŸ»ã‚„ã‚¨ã‚³ãƒ¼ã€ãƒ¬ãƒ³ãƒˆã‚²ãƒ³ã€å¿ƒé›»å›³ç­‰ã‚’å®Ÿæ–½ã„ãŸã—ã¾ã™ã€‚', note: 'æ¤œæŸ»å†…å®¹ã¯å¹´é½¢ãƒ»æŒç—…ãƒ»ç—‡çŠ¶ã«ã‚ˆã‚Šå¤‰ã‚ã‚Šã¾ã™ã€‚', flowType: 'main' },
  { id: 4, step: 'å†è¨º', title: 'çµæžœã‚’ã‚‚ã¨ã«æ²»ç™‚æ–¹é‡ã‚’ã”æ¡ˆå†…', body: 'æ¤œæŸ»çµæžœã‚’ã‚‚ã¨ã«ã€å…·ä½“çš„ãªæ²»ç™‚æ–¹é‡ã‚’ã”æ¡ˆå†…ã„ãŸã—ã¾ã™ã€‚', note: 'ã€Œæ­¯ã‚’æ®‹ã™ï¼æŠœæ­¯ãŒå¿…è¦ã€ãªã©ã®åˆ¤æ–­ã‚‚ã€ã“ã“ã§æ•´ç†ã—ã¦ãŠä¼ãˆã—ã¾ã™ã€‚', flowType: 'main' },
  { id: 5, step: 'æ‰‹è¡“', title: 'éº»é…”ã®å®‰å…¨æ€§ã‚’ç¢ºèªã—ã¦ã‹ã‚‰å®Ÿæ–½', body: 'æ‰‹è¡“ã‚’å¿…è¦ã¨ã™ã‚‹ç—…çŠ¶ã®å ´åˆã¯ã€éº»é…”ã«å¯¾å¿œãŒå¯èƒ½ã‹ã‚’æ¤œæŸ»çµæžœã‚’ã‚‚ã¨ã«æ…Žé‡ã«åˆ¤æ–­ã„ãŸã—ã¾ã™ã€‚', note: 'å½“æ—¥ã®æµã‚Œã¯ã€å€‹åˆ¥ã«åˆ†ã‹ã‚Šã‚„ã™ãã”æ¡ˆå†…ã—ã¾ã™ã€‚', flowType: 'surgery' },
  { id: 6, step: 'æ¤œè¨º', title: 'è¡“å¾Œã®çµŒéŽã‚’ãƒã‚§ãƒƒã‚¯', body: 'ç´„1é€±é–“ã‚’ç›®å®‰ã«è¡“å¾Œã®æ¤œè¨ºã‚’è¡Œã„ã¾ã™ã€‚\næ²»ã‚Šå…·åˆã‚„ç—›ã¿ã®æ§˜å­ã€é£Ÿäº‹ã®çŠ¶æ³ãªã©ã‚’ç¢ºèªã—ã¾ã™ã€‚', note: 'å›žå¾©ã®ãƒšãƒ¼ã‚¹ã«ã¯å€‹ä½“å·®ãŒã‚ã‚Šã¾ã™ã€‚', flowType: 'surgery' },
];

// --- æ­¯ç£¨ãã‚¬ã‚¤ãƒ‰LP ---
const BRUSHING_IMG_BASE = 'https://kinswith-vet.com/wp-content/themes/kinswith-2.2.6/assets/images/service/dental/brushing-teeth/';
const BRUSHING_IMG = {
  fv: `${BRUSHING_IMG_BASE}fv.webp`,
  step01: `${BRUSHING_IMG_BASE}howto-step-01.webp`,
  step02: `${BRUSHING_IMG_BASE}howto-step-02.webp`,
  step03: `${BRUSHING_IMG_BASE}howto-step-03.webp`,
  step04: `${BRUSHING_IMG_BASE}howto-step-04.webp`,
  step05: `${BRUSHING_IMG_BASE}howto-step-05.webp`,
  step06: `${BRUSHING_IMG_BASE}howto-step-06.webp`,
  why1: `${BRUSHING_IMG_BASE}why-contents1-image-01.webp`,
};
const BRUSHING_LOGO_URL = 'https://kinswith-vet.com/wp-content/themes/kinswith-2.2.6/assets/images/common/logo.svg';

const BRUSHING_LP_PAGES = [
  {
    id: 1, type: 'intro',
    title: 'çŠ¬ã®æ­¯ç£¨ãã®ã‚„ã‚Šæ–¹',
    subtitle: 'çŠ¬ãƒ»çŒ«ã®æ­¯åŒ»è€…ã•ã‚“ç›£ä¿®',
    body: '3æ­³ä»¥ä¸Šã®çŠ¬ã®ãŠã‚ˆã8å‰²ãŒæ­¯å‘¨ç—…ã‚’æŠ±ãˆã¦ã„ã‚‹ã¨è¨€ã‚ã‚Œã¦ã„ã¾ã™ã€‚\næ­¯ç£¨ãã¯æ­¯å‘¨ç—…äºˆé˜²ã®ã„ã¡ã°ã‚“ã®å‘³æ–¹ã€‚\nã“ã®ã‚¬ã‚¤ãƒ‰ã§ã¯ã€æ­£ã—ã„æ‰‹é †ã‚’ä¸€æ­©ãšã¤é€²ã‚ã‚‰ã‚Œã¾ã™ã€‚',
    image: BRUSHING_IMG.fv,
  },
  {
    id: 2, type: 'prep',
    title: 'ã¯ã˜ã‚ã«æº–å‚™ã™ã‚‹ã‚‚ã®',
    prepItems: [
      { name: 'æ­¯ç£¨ãã‚¸ã‚§ãƒ«', points: ['æ„›çŠ¬ãŒå¥½ã‚€å‘³ã‚’é¸ã¶'] },
      { name: 'æ­¯ãƒ–ãƒ©ã‚·', points: ['æŸ”ã‚‰ã‹ã„ã‚‚ã®ã‚’é¸ã¶', 'ã‚¬ãƒ¼ã‚¼ã‚„ã‚·ãƒ¼ãƒˆã‚‚OK'] },
    ],
    body: 'è‹¦æ‰‹ãªå­ã®å¤šã„æ­¯ç£¨ãã®æ™‚é–“ã‚’ã€\nã€Œæ¥½ã—ã„ã‚‚ã®ã€ã¨æ€ã£ã¦ã‚‚ã‚‰ã†ã“ã¨ãŒå¤§åˆ‡ã€‚',
    products: [
      { name: 'DENTAL GEL for dogs', desc: 'æ­¯ç£¨ããŒå¥½ãã«ãªã‚‹ç¾Žå‘³ã—ã„ã‚¸ã‚§ãƒ«', url: 'https://kinswith-vet.com/product/1754/', image: 'https://kinswith-vet-com.s3.us-west-1.amazonaws.com/wp-content/uploads/2023/11/13021818/DENTAL-GEL-for-dogs.webp' },
      { name: 'æ³¡é›ªãƒ—ãƒ©ãƒãƒŠãƒŠãƒŽæ­¯ãƒ–ãƒ©ã‚·', desc: 'ã¨ã‚ã‘ã‚‹ã‚ˆã†ãªæŸ”ã‚‰ã‹ã•ã§åˆºæ¿€ã‚’æŠ‘ãˆãŸ', url: 'https://kinswith-vet.com/product/1750/', image: 'https://kinswith-vet-com.s3.us-west-1.amazonaws.com/wp-content/uploads/2024/02/17231210/wawyknash.webp' },
    ],
  },
  {
    id: 3, type: 'challenge', step: 'STEP 02', challengeIndex: 0,
    title: 'ãŠå£ã‚’è§¦ã‚‰ã‚Œã‚‹ã“ã¨ã«æ…£ã‚Œã‚ˆã†',
    body: 'ã”è¤’ç¾Žã®ã‚¸ã‚§ãƒ«ã‚’ãŠæ‰‹å…ƒã«ç”¨æ„ã—ã¦ã€è§¦ã‚‰ã›ã¦ãã‚ŒãŸã‚‰ã™ãã«ã‚ã’ã¾ã—ã‚‡ã†ã€‚ã¾ãšã¯æ•°ç§’ã‹ã‚‰ã€‚',
    tips: ['æŠ¼ã•ãˆã¤ã‘ãªã„', 'å«ŒãŒã£ãŸã‚‰ç„¡ç†ã—ãªã„', 'ã¾ã æ­¯ãƒ–ãƒ©ã‚·ã¯ä½¿ã‚ãªã„', 'å¾ã€…ã«è§¦ã‚‹æ™‚é–“ã‚’ä¼¸ã°ã™'],
    image: BRUSHING_IMG.step02,
    rewards: {
      pet: ['ãŠå£ã®ã¾ã‚ã‚Šã€è§¦ã‚‰ã›ã¦ãã‚ŒãŸã­ã€‚ãˆã‚‰ã„ï¼','ã¡ã‚‡ã£ã¨ã³ã£ãã‚Šã—ãŸã‹ã‚‚ã ã‘ã©ã€ãŒã‚“ã°ã£ãŸã­','æœ€åˆã®ä¸€æ­©ã‚’ã‚¯ãƒªã‚¢ã€‚ãã¿ã€ã™ã”ã„ã‚ˆ','ãƒ‰ã‚­ãƒ‰ã‚­ã—ãŸã‚ˆã­ã€‚ã§ã‚‚ä¹—ã‚Šè¶ŠãˆãŸï¼','ã“ã®èª¿å­ã“ã®èª¿å­ã€œï¼'],
      owner: ['ç„¦ã‚‰ãšå‘ãåˆãˆãŸã“ã¨ã€ãã‚Œã ã‘ã§å¤§ããªä¸€æ­©ã§ã™','è§¦ã‚‰ã›ã¦ãã‚Œã‚‹ã¾ã§å¾…ã¦ãŸã‚ãªãŸã‚‚ã™ã”ã„ã§ã™','ã†ã¾ãã„ã‹ãªãã¦ã‚‚ã€ã‚„ã‚ã†ã¨ã—ãŸã“ã¨ãŒå‰ã„ã‚“ã§ã™','ã€Œã‚„ã£ã¦ã¿ã‚ˆã†ã€ã¨æ€ãˆãŸã“ã¨è‡ªä½“ãŒã€ã‚‚ã†å‰é€²ã§ã™','ã“ã“ã‹ã‚‰å§‹ã¾ã‚‹ã‚±ã‚¢ã®ç¬¬ä¸€æ­©ã€‚ãŠã‚ã§ã¨ã†ã”ã–ã„ã¾ã™'],
    },
  },
  {
    id: 4, type: 'challenge', step: 'STEP 03', challengeIndex: 1,
    title: 'å”‡ã‚’ã‚ãã£ã¦ã¿ã‚ˆã†',
    body: 'ã€Œå”‡ã‚’ã‚ãã‚‹ â†’ ã”è¤’ç¾Žã‚’ã‚ã’ã‚‹ã€ã‚’ç¹°ã‚Šè¿”ã—ã¾ã™ã€‚å«ŒãŒã£ãŸã‚‰ STEP 02 ã«æˆ»ã£ã¦å¤§ä¸ˆå¤«ã€‚',
    tips: ['ã‚„ã•ã—ãã‚†ã£ãã‚Š', 'å«ŒãŒã£ãŸã‚‰å‰ã®STEPã«æˆ»ã‚‹', 'ã”è¤’ç¾Žã¯ã™ãã‚ã’ã‚‹'],
    image: BRUSHING_IMG.step03,
    rewards: {
      pet: ['ã¡ã‚ƒã‚“ã¨è¦‹ã›ã¦ãã‚Œã¦ã‚ã‚ŠãŒã¨ã†ï¼','ãŠå£ã€è¦‹ã›ã¦ãã‚ŒãŸã­ã€‚ä¿¡é ¼ã®è¨¼ã ã‚ˆ','ã‚ãã‚‰ã‚Œã¦ã‚‚æ€’ã‚‰ãªã‹ã£ãŸï¼ãˆã‚‰ã™ãŽ','ãã¿ã®ãŒã‚“ã°ã‚Šã€ã¡ã‚ƒã‚“ã¨è¦‹ã¦ã‚‹ã‚ˆ','ã“ã®å‹‡æ°—ã€æ‹æ‰‹ï¼'],
      owner: ['å«ŒãŒã£ã¦ã‚‚è«¦ã‚ãªã‹ã£ãŸã‚ãªãŸã‚‚ã™ã”ã„ã§ã™','ãŠäº’ã„ã®ä¿¡é ¼é–¢ä¿‚ãŒæ·±ã¾ã£ã¦ã„ã¾ã™','ã€Œæˆ»ã£ã¦ã‚‚ã„ã„ã€ã¨æ€ãˆã‚‹ä½™è£•ã€å¤§äº‹ã§ã™','ã“ã®ä¸€æ­©ãŒæœªæ¥ã®æ­¯ã®å¥åº·ã«ã¤ãªãŒã‚Šã¾ã™','ã†ã¾ãã§ããªãã¦ã‚‚ã€ç·´ç¿’ã—ãŸæ™‚é–“ã«ã¡ã‚ƒã‚“ã¨æ„å‘³ãŒã‚ã‚Šã¾ã™'],
    },
  },
  {
    id: 5, type: 'challenge', step: 'STEP 04', challengeIndex: 2,
    title: 'æ­¯ãƒ»æ­¯ããã‚’è§¦ã£ã¦ã¿ã‚ˆã†',
    body: 'æŒ‡ã§æ­¯ã‚„æ­¯ããã«ã‚¿ãƒƒãƒ â†’ ã”è¤’ç¾Žã€‚æœ€åˆã¯å‰æ­¯ã‹ã‚‰ã€æ…£ã‚ŒãŸã‚‰å°‘ã—ãšã¤å¥¥ã¸ã€‚',
    tips: ['åˆ‡æ­¯ã¨çŠ¬æ­¯ã‹ã‚‰', 'å¥¥æ­¯ã¯ç„¡ç†ã—ãªã„', 'ã‚¿ãƒƒãƒã—ãŸã‚‰ã™ãã”è¤’ç¾Ž'],
    image: BRUSHING_IMG.step04,
    rewards: {
      pet: ['æ­¯ã‚’è§¦ã£ã¦ã‚‚æ€’ã‚‰ãªã‹ã£ãŸã­ã€‚ã™ã”ã„ï¼','ãŠå£ã®ä¸­ã¾ã§è§¦ã‚‰ã›ã¦ãã‚Œã‚‹ãªã‚“ã¦â€¦ä¿¡é ¼ã•ã‚Œã¦ã‚‹ãªã','æ­¯ããã‚¿ãƒƒãƒã€ã‚¯ãƒªã‚¢ï¼ãã¿ã¯å‹‡è€…ã ã‚ˆ','ã“ã“ã¾ã§ã§ããŸã‚‰ã€ã‚‚ã†æ­¯ç£¨ãä¸Šç´šè€…ã®å…¥å£ï¼','ãˆã‚‰ã„ã­ã‡â€¦ï¼ã»ã‚“ã¨ã«ãˆã‚‰ã„'],
      owner: ['ã“ã“ã¾ã§ã§ããŸã‚‰ã€ã‚‚ã†ç«‹æ´¾ãªæ­¯ç£¨ããƒˆãƒ¬ãƒ¼ãƒ‹ãƒ³ã‚°ã§ã™','ãŠå£ã®ä¸­ã‚’è§¦ã‚Œã‚‹ã‚ˆã†ã«ãªã‚‹ã®ã¯å¤§ããªé€²æ­©ã§ã™','æ„›çŠ¬ã®ãƒšãƒ¼ã‚¹ã«åˆã‚ã›ã‚‰ã‚Œã‚‹ã‚ãªãŸã€ç´ æ•µã§ã™','å®Ÿã¯ã“ã“ã¾ã§ãŒä¸€ç•ªã‚€ãšã‹ã—ã„ã€‚ã‚ˆãä¹—ã‚Šè¶Šãˆã¾ã—ãŸ','æ­¯åž¢ã‚±ã‚¢ã®åœŸå°ãŒã§ãã¾ã—ãŸã€‚è‡ªä¿¡ã‚’æŒã£ã¦ãã ã•ã„'],
    },
  },
  {
    id: 'vet1', type: 'vetCheck',
    title: 'ç£åŒ»å¸«CHECK',
    body: 'ã¨ã¦ã‚‚å¤§äº‹ãªã“ã¨ã¯ã€æ„›çŠ¬ã«ã¨ã£ã¦æ­¯ç£¨ãã®æ™‚é–“ãŒã€Œå¬‰ã—ã„æ™‚é–“ã€ã€Œæ¥½ã—ã„æ™‚é–“ã€ã¨æœ€åˆã«èªè­˜ã—ã¦ã‚‚ã‚‰ã†äº‹ã§ã™ã€‚\n\næ¬¡ã‹ã‚‰ã¯å®Ÿè·µç·¨ã®ã”èª¬æ˜Žã¨ãªã‚Šã¾ã™ã€‚\n\nä¸€ã¤ä¸€ã¤ã®ã‚¹ãƒ†ãƒƒãƒ—ã«3æ—¥ã€œ1é€±é–“ã‹ã‘ã¦ã”æº–å‚™ã‚’é ‚ã„ã¦ã‚‚å•é¡Œã”ã–ã„ã¾ã›ã‚“ã€‚\n\nç„¦ã‚‰ãšã«æº–å‚™ç·¨ãŒå‡ºæ¥ã¦ã‹ã‚‰å®Ÿè·µã¸ãŠé€²ã¿ãã ã•ã„ã€‚',
  },
  {
    id: 6, type: 'challenge', step: 'STEP 05', challengeIndex: 3,
    title: 'å‰æ­¯ã‚’ç£¨ã„ã¦ã¿ã‚ˆã†',
    body: 'ä¸Šé¡Žã‚’æŒã¡ä¸Šã’ã‚‹ã‚ˆã†ã«å”‡ã‚’å¼•ãä¸Šã’ã¦ã€æ­¯ãƒ–ãƒ©ã‚·ã‚’45åº¦ã«å‚¾ã‘ã¦ç£¨ãã¾ã™ã€‚',
    tips: ['æ­¯ãƒ–ãƒ©ã‚·ã¯45åº¦ã«å‚¾ã‘ã‚‹', 'æ­¯èŒŽã«æ²¿ã£ã¦ã‚„ã•ã—ã', 'æœ€åˆã¯æ•°æœ¬ã§OK'],
    image: BRUSHING_IMG.step05,
    rewards: {
      pet: ['æ­¯ãƒ–ãƒ©ã‚·ã€å—ã‘å…¥ã‚Œã¦ãã‚ŒãŸã‚“ã ã­ï¼','ãƒ–ãƒ©ã‚·ã§ç£¨ã‹ã›ã¦ãã‚Œã‚‹ãªã‚“ã¦â€¦ãã¿ã€å¤©æ‰ã§ã¯ï¼Ÿ','ã—ã‚ƒã“ã—ã‚ƒã“â€¦ãŒã‚“ã°ã£ãŸã­ï¼','æ­¯ç£¨ãã€ã§ãã¡ã‚ƒã£ãŸã­ï¼ã™ã”ã„ã“ã¨ã ã‚ˆ','ãƒ—ãƒ­ã®åŸŸã«è¿‘ã¥ã„ã¦ã‚‹ã‚ˆã€ã¾ã˜ã§'],
      owner: ['æ„›çŠ¬ã¨ä¸€ç·’ã«ã“ã“ã¾ã§æ¥ã‚ŒãŸã“ã¨ã€èª‡ã£ã¦ã„ã„ã§ã™','ãƒ–ãƒ©ã‚·ã‚’ä½¿ãˆã‚‹ã‚ˆã†ã«ãªã£ãŸã®ã¯å¤§ããªãƒžã‚¤ãƒ«ã‚¹ãƒˆãƒ¼ãƒ³ã§ã™','æœ€åˆã¯æ•°æœ¬ã§ååˆ†ã€‚å®Œç’§ã‚’ç›®æŒ‡ã•ãªãã¦ã„ã„ã‚“ã§ã™','ã“ã“ã¾ã§ã§ãã‚‹ãªã‚“ã¦ã€æ„›çŠ¬ã‚‚ã‚ãªãŸã‚’ä¿¡é ¼ã—ã¦ã‚‹è¨¼æ‹ ã§ã™','æ­¯åž¢é™¤åŽ»çŽ‡ãŒãã£ã¨ä¸ŠãŒã‚Šã¾ã™ã€‚ã™ã°ã‚‰ã—ã„ï¼'],
    },
  },
  {
    id: 7, type: 'challenge', step: 'STEP 06', challengeIndex: 4,
    title: 'ãƒ‡ãƒ³ã‚¿ãƒ«ã‚±ã‚¢ã‚¦ã‚©ãƒ¼ã‚¿ãƒ¼ã‚’ä½œã‚ã†',
    body: 'ã‚¸ã‚§ãƒ«ã‚’1ã€œ2cmå‡ºã—ã¦ã€æ™®æ®µã®é£²ã¿æ°´ã«æº¶ã‹ã—ã¾ã™ã€‚æ‰‹è»½ã«ã‚±ã‚¢æˆåˆ†ã‚’ãŠå£å…¨ä½“ã«å±Šã‘ã‚‰ã‚Œã¾ã™ã€‚',
    tips: ['ã‚¸ã‚§ãƒ«1ã€œ2cmãŒç›®å®‰', 'ã„ã¤ã‚‚ã®é£²ã¿æ°´ã«æº¶ã‹ã™ã ã‘', 'æ­¯ç£¨ãå¾Œã®ä»•ä¸Šã’ã«ã´ã£ãŸã‚Š'],
    image: BRUSHING_IMG.step06,
    rewards: {
      pet: ['ãŠã„ã—ãé£²ã‚ãŸã‹ãªï¼Ÿ','ã”ãã”ãâ€¦ã‚±ã‚¢å®Œäº†ï¼ãŠã¤ã‹ã‚Œã•ã¾','æ°´ã‚’é£²ã‚€ã ã‘ã§ã‚±ã‚¢ã§ãã¡ã‚ƒã†ã€‚ãã¿ã€ãƒ©ã‚¯ã—ã¦ã‚‹ã­ã€œ','ãƒ‡ãƒ³ã‚¿ãƒ«ã‚¦ã‚©ãƒ¼ã‚¿ãƒ¼ã€æ°—ã«å…¥ã£ãŸï¼Ÿ','ä»•ä¸Šã’ã¾ã§å®Œç’§ã€‚ãã¿ã¯ãˆã‚‰ã„ï¼'],
      owner: ['ä»•ä¸Šã’ã¾ã§ä¸å¯§ã«ã§ãã¾ã—ãŸã€‚ã™ã°ã‚‰ã—ã„ã§ã™','ç°¡å˜ã ã‘ã©åŠ¹æžœçš„ã€‚æ¯Žæ—¥ã®ã‚±ã‚¢ã«å–ã‚Šå…¥ã‚Œã‚„ã™ã„ã§ã™ã‚ˆ','ã“ã“ã¾ã§ã®å…¨ã‚¹ãƒ†ãƒƒãƒ—ã€ãŠã¤ã‹ã‚Œã•ã¾ã§ã—ãŸ','æ„›çŠ¬ã®å¥åº·ã‚’å®ˆã‚‹ç¿’æ…£ãŒã€ã‚‚ã†å§‹ã¾ã£ã¦ã„ã¾ã™','ã“ã®ä»•ä¸Šã’ã ã‘ã§ã‚‚æ¯Žæ—¥ã‚„ã‚‹ä¾¡å€¤ãŒã‚ã‚Šã¾ã™ã‚ˆ'],
    },
  },
  {
    id: 8, type: 'info',
    title: 'è‹¦æ‰‹ãªå­ã¸ã®ã‚¢ãƒ‰ãƒã‚¤ã‚¹',
    body: 'æ­¯ç£¨ãã‚’ã™ã‚‹æ™‚ã¯ã€æ„›çŠ¬ãŒè½ã¡ç€ã„ã¦ã„ã‚‹æ™‚é–“å¸¯ã¨ç’°å¢ƒã‚’é¸ã‚“ã§ã‚ã’ã¾ã—ã‚‡ã†ã€‚\n\nã©ã†ã—ã¦ã‚‚é›£ã—ã„å ´åˆã¯ã€STEP 06 ã®ãƒ‡ãƒ³ã‚¿ãƒ«ã‚¦ã‚©ãƒ¼ã‚¿ãƒ¼ã‹ã‚‰å§‹ã‚ã‚‹ã®ã‚‚ãŠã™ã™ã‚ã§ã™ã€‚',
    doctorNote: 'æ­¯çŸ³ãŒã¤ã„ã¦ã—ã¾ã£ãŸå ´åˆã¯å‹•ç‰©ç—…é™¢ã§ã®æ–½è¡“ãŒå¿…è¦ã§ã™ã€‚æ­¯èŒŽã®èµ¤ã¿ã‚„å£è‡­ãŒæ°—ã«ãªã‚‹ã¨ãã¯ã€ä¸€åº¦ã”ç›¸è«‡ãã ã•ã„ã€‚',
    image: BRUSHING_IMG.why1,
  },
  {
    id: 9, type: 'product',
    title: 'ãŠã™ã™ã‚ã‚¢ã‚¤ãƒ†ãƒ ',
    subtitle: 'ã¾ã ãŠæ°—ã«å…¥ã‚ŠãŒè¦‹ã¤ã‹ã£ã¦ã„ãªã‘ã‚Œã°ã€ã“ã¡ã‚‰ã‚‚ã©ã†ãžã€‚',
    products: [
      { name: 'DENTAL GEL for dogs', desc: 'æ­¯ç£¨ããŒå¥½ãã«ãªã‚‹ç¾Žå‘³ã—ã„ã‚¸ã‚§ãƒ«', url: 'https://kinswith-vet.com/product/1754/', image: 'https://kinswith-vet-com.s3.us-west-1.amazonaws.com/wp-content/uploads/2023/11/13021818/DENTAL-GEL-for-dogs.webp' },
      { name: 'æ³¡é›ªãƒ—ãƒ©ãƒãƒŠãƒŠãƒŽæ­¯ãƒ–ãƒ©ã‚·', desc: 'ã¨ã‚ã‘ã‚‹ã‚ˆã†ãªæŸ”ã‚‰ã‹ã•ã§åˆºæ¿€ã‚’æŠ‘ãˆãŸ', url: 'https://kinswith-vet.com/product/1750/', image: 'https://kinswith-vet-com.s3.us-west-1.amazonaws.com/wp-content/uploads/2024/02/17231210/wawyknash.webp' },
    ],
  },
  {
    id: 10, type: 'complete',
    title: 'ãŠã¤ã‹ã‚Œã•ã¾ï¼',
    messages: [
      'ã€Œä»Šæ—¥ã‚„ã‚ŒãŸã€ã“ã¨ãŒä½•ã‚ˆã‚Šã™ã”ã„ã€‚\nå®Œç’§ã˜ã‚ƒãªãã¦å¤§ä¸ˆå¤«ã€‚\nã¾ãŸã“ã“ã«æ¥ã¦ãã‚ŒãŸã‚‰ã„ã¤ã§ã‚‚ä¸€ç·’ã«å§‹ã‚ã‚‰ã‚Œã¾ã™ã€‚',
      'ãœã‚“ã¶ã‚¯ãƒªã‚¢ã§ããŸã­ï¼\nã‚ãªãŸã¨{name}ã®æ­¯ç£¨ãæ™‚é–“ãŒã€ã‚‚ã£ã¨ã‚‚ã£ã¨æ¥½ã—ããªã‚Šã¾ã™ã‚ˆã†ã«ã€‚',
      'ã“ã“ã¾ã§æ¥ã‚ŒãŸã®ã¯ã€ã‚ãªãŸãŒè«¦ã‚ãªã‹ã£ãŸã‹ã‚‰ã€‚\n{name}ã‚‚ãã£ã¨ã€Œã‚ã‚ŠãŒã¨ã†ã€ã£ã¦æ€ã£ã¦ã‚‹ã‚ˆã€‚',
    ],
  },
];

const BRUSHING_EXIT_MESSAGES = [
  'ã“ã“ã¾ã§ã§ååˆ†ã€‚ã¾ãŸã‚„ã‚ŠãŸããªã£ãŸã‚‰æ¥ã¦ã­',
  'ä»Šæ—¥ã¯ãŠã—ã¾ã„ï¼{name}ã‚‚ã‚ãªãŸã‚‚ãŠã¤ã‹ã‚Œã•ã¾',
  'ç„¡ç†ã—ãªã„ã®ã‚‚ã€å¤§äº‹ãªã‚±ã‚¢ã®ã²ã¨ã¤ã§ã™',
  'ç¶šãã¯ã„ã¤ã§ã‚‚ã€‚{name}ã®ãƒšãƒ¼ã‚¹ã§å¤§ä¸ˆå¤«',
  'ä»Šæ—¥ãŒã‚“ã°ã£ãŸåˆ†ã€ã¡ã‚ƒã‚“ã¨{name}ã«å±Šã„ã¦ã‚‹ã‚ˆ',
];

const BRUSHING_TOTAL = 5;
const brushingRandomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const brushingReplaceName = (text, name) => text.replace(/\{name\}/g, name || 'ã‚ãªãŸã®æ„›çŠ¬');

function BrushingStepImage({ src, alt }) {
  return (
    <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', marginBottom: '14px', backgroundColor: '#F5EDE4' }}>
      <img src={src} alt={alt || ''} style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }}
        onError={(e) => {
          e.target.parentElement.style.display = 'flex';
          e.target.parentElement.style.alignItems = 'center';
          e.target.parentElement.style.justifyContent = 'center';
          e.target.parentElement.style.height = '80px';
          e.target.outerHTML = '<span style="font-size:12px;color:#A69B8D">ç”»åƒã‚’èª­ã¿è¾¼ã¿ä¸­â€¦</span>';
        }}
      />
    </div>
  );
}
const API_URL = "https://wept-api.onrender.com";

// ç¾åœ¨ã®ãƒšãƒ¼ã‚¸ãŒjournalè¨˜äº‹ã‹ã©ã†ã‹åˆ¤å®š
function getJournalKey() {
  const path = window.location.pathname;
  const match = path.match(/\/(journal\/\d+)/);
  return match ? match[1] : null;
}

// WEPT_ARTICLES ã‹ã‚‰è¨˜äº‹ãƒ‡ãƒ¼ã‚¿ã‚’å–å¾—ï¼ˆPHPå´ã§wp_localize_scriptã§æ³¨å…¥æ¸ˆã¿ï¼‰
function getArticleByKey(key) {
  if (typeof WEPT_ARTICLES !== 'undefined' && WEPT_ARTICLES[key]) {
    return WEPT_ARTICLES[key];
  }
  return null;
}

// GA4 ãƒˆãƒ©ãƒƒã‚­ãƒ³ã‚°
function trackEvent(eventName, params = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
  }
}

function WebpilotChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState("menu");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  
  // å†™çœŸãƒã‚§ãƒƒã‚¯ç”¨
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [imageConverting, setImageConverting] = useState(false);
  const fileInputRef = useRef(null);
  
  // å£è‡­ãƒã‚§ãƒƒã‚¯ç”¨
  const [breathStep, setBreathStep] = useState(0);
  const [breathAnswers, setBreathAnswers] = useState({});
  const [breathResult, setBreathResult] = useState(null);
  
  // LPç”¨
  const [dentalLpPage, setDentalLpPage] = useState(0);
  const [flowLpPage, setFlowLpPage] = useState(0);

  // æ­¯ç£¨ãã‚¬ã‚¤ãƒ‰LPç”¨
  const [brushingPage, setBrushingPage] = useState(0);
  const [petName, setPetName] = useState('');
  const [clearedSteps, setClearedSteps] = useState(new Set());
  const [showReward, setShowReward] = useState(null);
  const [showBrushingExit, setShowBrushingExit] = useState(false);
  const [brushingExitMsg, setBrushingExitMsg] = useState('');
  const [confetti, setConfetti] = useState([]);
  
  const messagesEndRef = useRef(null);
  const openedAtRef = useRef(null);
  const isSuggestionRef = useRef(false);

  // èƒŒé¢ã‚¹ã‚¯ãƒ­ãƒ¼ãƒ«ãƒ­ãƒƒã‚¯
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ãƒãƒ£ãƒƒãƒˆãƒ‰ãƒƒãƒˆã‚¢ãƒ‹ãƒ¡ãƒ¼ã‚·ãƒ§ãƒ³ç”¨CSSæ³¨å…¥
  useEffect(() => {
    if (!document.getElementById('wept-dot-animation')) {
      const style = document.createElement('style');
      style.id = 'wept-dot-animation';
      style.textContent = `
        @keyframes weptDotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
    if (!document.getElementById('wept-brushing-animation')) {
      const style = document.createElement('style');
      style.id = 'wept-brushing-animation';
      style.textContent = `
        @keyframes confettiFall { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(700px) rotate(720deg); opacity: 0; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // æ­¯ç£¨ãã‚¬ã‚¤ãƒ‰ç´™å¹é›ª
  useEffect(() => {
    if (currentView === 'brushing-lp') {
      const bp = BRUSHING_LP_PAGES[brushingPage];
      if (bp && bp.type === 'complete' && clearedSteps.size === BRUSHING_TOTAL) {
        setConfetti(Array.from({ length: 40 }, (_, i) => ({
          id: i, left: Math.random() * 100, delay: Math.random() * 2,
          duration: 2 + Math.random() * 2,
          color: ['#8B6B5C', '#E8DDD3', '#965D57', '#F5EDE4', '#FDF8F3', '#D4C9BC'][Math.floor(Math.random() * 6)],
          size: 6 + Math.random() * 8, rotation: Math.random() * 360,
        })));
      }
    }
  }, [brushingPage, clearedSteps, currentView]);

  const close = () => {
    const duration = openedAtRef.current ? Math.round((Date.now() - openedAtRef.current) / 1000) : 0;
    trackEvent('wept_close', { current_view: currentView, duration_sec: duration });
    setIsOpen(false);
    setTimeout(() => {
      setCurrentView("menu");
      setMessages([]);
      setInputValue("");
      setSelectedImage(null);
      setImagePreview(null);
      setDiagnosisResult(null);
      setImageConverting(false);
      setBreathStep(0);
      setBreathAnswers({});
      setBreathResult(null);
      setDentalLpPage(0);
      setFlowLpPage(0);
      setBrushingPage(0);
      setPetName('');
      setClearedSteps(new Set());
      setShowReward(null);
      setShowBrushingExit(false);
      setConfetti([]);
    }, 300);
  };

  const backToMenu = () => {
    setCurrentView("menu");
    setMessages([]);
    setSelectedImage(null);
    setImagePreview(null);
    setDiagnosisResult(null);
    setImageConverting(false);
    setBreathStep(0);
    setBreathAnswers({});
    setBreathResult(null);
    setBrushingPage(0);
    setPetName('');
    setClearedSteps(new Set());
    setShowReward(null);
    setShowBrushingExit(false);
    setConfetti([]);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage = inputValue.trim();
    trackEvent('wept_chat_send', { message_length: userMessage.length, is_suggestion: isSuggestionRef.current });
    isSuggestionRef.current = false;
    setInputValue("");
    setCurrentView("chat");
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, context: [] })
      });

      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
      const data = await response.json();

      setMessages((prev) => [...prev, {
        type: "bot",
        text: data.reply || "ã™ã¿ã¾ã›ã‚“ã€å›žç­”ã‚’å–å¾—ã§ãã¾ã›ã‚“ã§ã—ãŸã€‚",
        articles: data.articles || []
      }]);
    } catch (error) {
      console.error("Chat API Error:", error);
      setMessages((prev) => [...prev, {
        type: "bot",
        text: "ã™ã¿ã¾ã›ã‚“ã€é€šä¿¡ã‚¨ãƒ©ãƒ¼ãŒç™ºç”Ÿã—ã¾ã—ãŸã€‚ã—ã°ã‚‰ãã—ã¦ã‹ã‚‰ã‚‚ã†ä¸€åº¦ãŠè©¦ã—ãã ã•ã„ã€‚",
        articles: []
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeatureClick = (feature) => {
    trackEvent('wept_menu_select', { feature: feature });
    if (feature === 'photo') {
      setCurrentView('photo-check');
      setSelectedImage(null);
      setImagePreview(null);
      setDiagnosisResult(null);
    } else if (feature === 'breath') {
      setCurrentView('breath-check');
      setBreathStep(0);
      setBreathAnswers({});
      setBreathResult(null);
    } else if (feature === 'dental-lp') {
      setCurrentView('dental-lp');
      setDentalLpPage(0);
    } else if (feature === 'flow-lp') {
      setCurrentView('flow-lp');
      setFlowLpPage(0);
    } else if (feature === 'brushing-lp') {
      setCurrentView('brushing-lp');
      setBrushingPage(0);
    } else if (feature === 'article-summary') {
      setCurrentView('article-summary');
      const jk = getJournalKey();
      if (jk) { const a = getArticleByKey(jk); trackEvent('wept_article_view', { article_key: jk, article_title: a?.title || '' }); }
    }
  };

  // HEICåˆ¤å®šãƒ˜ãƒ«ãƒ‘ãƒ¼
  const isHeicFile = (file) => {
    if (file.type && (file.type === 'image/heic' || file.type === 'image/heif')) return true;
    const name = (file.name || '').toLowerCase();
    return name.endsWith('.heic') || name.endsWith('.heif');
  };

  // ç”»åƒåœ§ç¸®ï¼ˆHEICâ†’JPGå¤‰æ› + Canvasåœ§ç¸®ï¼‰
  const compressImage = async (file, maxWidth = 1024, quality = 0.7) => {
    let processedFile = file;

    // HEICå¤‰æ›
    if (isHeicFile(file)) {
      if (typeof heic2any !== 'undefined') {
        try {
          const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.8 });
          const converted = Array.isArray(blob) ? blob[0] : blob;
          processedFile = new File([converted], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' });
        } catch (e) {
          console.warn('HEIC conversion failed, using original:', e);
        }
      } else {
        console.warn('heic2any not loaded, sending original file');
      }
    }

    // Canvasåœ§ç¸®
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > maxWidth) {
          h = Math.round(h * maxWidth / w);
          w = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], processedFile.name || 'photo.jpg', { type: 'image/jpeg' }));
          } else {
            resolve(processedFile);
          }
        }, 'image/jpeg', quality);
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        resolve(processedFile);
      };
      img.src = URL.createObjectURL(processedFile);
    });
  };

  // å†™çœŸãƒã‚§ãƒƒã‚¯ - ç”»åƒé¸æŠž
  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageConverting(true);

    try {
      const compressed = await compressImage(file);
      setSelectedImage(compressed);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageConverting(false);
      };
      reader.onerror = () => setImageConverting(false);
      reader.readAsDataURL(compressed);
    } catch (err) {
      console.warn('Image processing failed, using original:', err);
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageConverting(false);
      };
      reader.onerror = () => setImageConverting(false);
      reader.readAsDataURL(file);
    }
  };

  const analyzePhoto = async () => {
    if (!selectedImage) return;
    setIsLoading(true);
    trackEvent('wept_photo_submit');
    
    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: formData
      });
      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
      const data = await response.json();
      setDiagnosisResult(data);
      setCurrentView('photo-result');
    } catch (error) {
      console.error("Error:", error);
      setDiagnosisResult({
        prediction: 'è¨ºæ–­ã§ãã¾ã›ã‚“ã§ã—ãŸ',
        confidence: '-',
        reason: 'é€šä¿¡ã‚¨ãƒ©ãƒ¼ãŒç™ºç”Ÿã—ã¾ã—ãŸã€‚ã‚‚ã†ä¸€åº¦ãŠè©¦ã—ãã ã•ã„ã€‚',
        advice: 'å†™çœŸã‚’æ’®ã‚Šç›´ã—ã¦å†åº¦ãƒã‚§ãƒƒã‚¯ã—ã¦ã¿ã¦ãã ã•ã„ã€‚'
      });
      setCurrentView('photo-result');
    } finally {
      setIsLoading(false);
    }
  };

  // å£è‡­ãƒã‚§ãƒƒã‚¯
  const handleBreathAnswer = (value) => {
    const questionId = BREATH_QUESTIONS[breathStep].id;
    const newAnswers = { ...breathAnswers, [questionId]: value };
    setBreathAnswers(newAnswers);
    
    if (breathStep < BREATH_QUESTIONS.length - 1) {
      setBreathStep(breathStep + 1);
    } else {
      const smellType = newAnswers.q1 || 'A';
      trackEvent('wept_breath_submit', { smell_type: smellType });
      setBreathResult(BREATH_CONTENT[smellType]);
      setCurrentView('breath-result');
    }
  };

  // ã‚¹ã‚¿ã‚¤ãƒ«å®šç¾©
  const s = {
    btn: { backgroundColor: '#FFF9F5', border: '1px solid #E8DDD3', borderRadius: '12px', padding: '12px 8px', cursor: 'pointer', textAlign: 'center', width: '100%' },
    btnPrimary: { backgroundColor: '#8B6B5C', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px', cursor: 'pointer', width: '100%', fontSize: '14px', fontWeight: 'bold' },
    btnSecondary: { backgroundColor: '#F5EDE4', color: '#5D5D5D', border: 'none', borderRadius: '12px', padding: '12px', cursor: 'pointer', width: '100%', fontSize: '14px' },
    btnClear: { background: 'linear-gradient(135deg, #8B6B5C 0%, #965D57 100%)', color: '#fff', border: 'none', borderRadius: '14px', padding: '14px', cursor: 'pointer', width: '100%', fontSize: '15px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(139,107,92,0.3)' },
    btnExit: { background: 'none', border: 'none', color: '#A69B8D', fontSize: '12px', cursor: 'pointer', padding: '8px', marginTop: '8px' },
    input: { flex: 1, borderRadius: '9999px', border: '1px solid #e8ddd3', padding: '10px 12px', backgroundColor: '#f5ede4', color: '#3d3d3d', fontSize: '14px', outline: 'none' },
    send: { width: '44px', height: '44px', borderRadius: '9999px', border: 0, backgroundColor: '#8B6B5C', color: '#fff', cursor: 'pointer', fontSize: '16px', flexShrink: 0 },
  };

  // å…±é€šãƒ˜ãƒƒãƒ€ãƒ¼
  const Header = ({ title }) => (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <div>
          {currentView !== 'menu' && (
            <button onClick={backToMenu} style={{ fontSize: '12px', color: '#A69B8D', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>â† æˆ»ã‚‹</button>
          )}
        </div>
        <button onClick={close} style={{ fontSize: '18px', color: '#A69B8D', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>âœ•</button>
      </div>
      <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#5D4E4E', paddingBottom: '8px', margin: 0 }}>{title}</div>
      <div style={{ width: '50%', height: '2px', backgroundColor: '#965D57' }} />
    </div>
  );

  return (
    <div className={`wept-shell ${isOpen ? 'is-open' : ''}`}>
      {/* FAB */}
      {!isOpen && (
        <button className="wept-fab" onClick={() => { setIsOpen(true); openedAtRef.current = Date.now(); trackEvent('wept_open'); }}>
          ç›¸è«‡ã™ã‚‹
        </button>
      )}

      {/* ã‚ªãƒ¼ãƒãƒ¼ãƒ¬ã‚¤ */}
      <div className={`wept-overlay ${isOpen ? 'is-open' : ''}`} onClick={close} />

      {/* ãƒ‰ãƒ­ãƒ¯ãƒ¼ */}
      <aside className={`wept-drawer ${isOpen ? 'is-open' : ''}`}>
        <div className="wept-body">
          
          {/* ===== menu ===== */}
          {currentView === "menu" && (
            <>
              <Header title="ã©ã†ã•ã‚Œã¾ã—ãŸã‹ï¼Ÿ" />
              {/* journal ãƒšãƒ¼ã‚¸ã®å ´åˆã®ã¿ã€Œè¨˜äº‹ã‚’è¦ç´„ã™ã‚‹ã€ãƒœã‚¿ãƒ³ã‚’è¡¨ç¤º */}
              {getJournalKey() && (
                <button onClick={() => handleFeatureClick('article-summary')} style={{ ...s.btnPrimary, marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <span>ðŸ“„</span><span>ã“ã®è¨˜äº‹ã‚’è¦ç´„ã™ã‚‹</span>
                </button>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                <button onClick={() => handleFeatureClick('photo')} style={s.btn}><div style={{ fontSize: '12px', fontWeight: 500, color: '#5D5D5D', lineHeight: 1.4 }}>å†™çœŸã§<br/>æ­¯å‘¨ç—…ãƒã‚§ãƒƒã‚¯</div></button>
                <button onClick={() => handleFeatureClick('breath')} style={s.btn}><div style={{ fontSize: '12px', fontWeight: 500, color: '#5D5D5D', lineHeight: 1.4 }}>å£è‡­ã®åŽŸå› <br/>ã‚»ãƒ«ãƒ•ãƒã‚§ãƒƒã‚¯</div></button>
                <button onClick={() => handleFeatureClick('dental-lp')} style={s.btn}><div style={{ fontSize: '12px', fontWeight: 500, color: '#5D5D5D', lineHeight: 1.4 }}>å½“é™¢ã®æ­¯ç§‘æ²»ç™‚<br/>å¼·ã¿ã¨ç‰¹å¾´</div></button>
                <button onClick={() => handleFeatureClick('flow-lp')} style={s.btn}><div style={{ fontSize: '12px', fontWeight: 500, color: '#5D5D5D', lineHeight: 1.4 }}>æ­¯ç§‘æ²»ç™‚ã®æµã‚Œ<br/>åˆè¨ºã‹ã‚‰æ‰‹è¡“ã¾ã§</div></button>
                <button onClick={() => handleFeatureClick('brushing-lp')} style={{ ...s.btn, gridColumn: '1 / -1' }}><div style={{ fontSize: '12px', fontWeight: 500, color: '#5D5D5D', lineHeight: 1.4 }}>çŠ¬ã®æ­¯ç£¨ã<br/>å®Ÿè·µã‚¬ã‚¤ãƒ‰</div></button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E8E0D5' }} />
                <span style={{ fontSize: '12px', color: '#A69B8D' }}>ã¾ãŸã¯</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E8E0D5' }} />
              </div>
              <p style={{ fontSize: '13px', marginBottom: '10px', color: '#5D5D5D' }}>æ°—ã«ãªã‚‹ç—‡çŠ¶ã‚„ãŠæ‚©ã¿ã‚’å…¥åŠ›ã—ã¦ãã ã•ã„</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {["æ­¯çŸ³ãŒæ°—ã«ãªã‚‹", "å£è‡­ãŒã™ã‚‹", "æ­¯èŒŽãŒèµ¤ã„", "æ­¯çŸ³ã‚’å–ã‚ŠãŸã„", "æ­¯ãŒæŠ˜ã‚ŒãŸ", "æ­¯ãŒã‚°ãƒ©ã‚°ãƒ©ã™ã‚‹", "ã”ã¯ã‚“ã‚’é£Ÿã¹ã«ããã†", "å£ã‚’ç—›ãŒã‚‹"].map((text, idx) => (
                  <button key={idx} onClick={() => { isSuggestionRef.current = true; setInputValue(text); }} style={{ fontSize: '11px', padding: '6px 10px', borderRadius: '9999px', backgroundColor: '#F5EDE4', color: '#5D5D5D', border: 'none', cursor: 'pointer' }}>{text}</button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.nativeEvent.isComposing && handleSend()} placeholder="ç—‡çŠ¶ã‚„ãŠæ‚©ã¿ã‚’å…¥åŠ›..." style={s.input} />
                <button onClick={handleSend} disabled={!inputValue.trim()} style={{ ...s.send, opacity: !inputValue.trim() ? 0.5 : 1 }}>â†‘</button>
              </div>
            </>
          )}

          {/* ===== photo-check ===== */}
          {currentView === "photo-check" && (
            <>
              <Header title="å†™çœŸã§æ­¯å‘¨ç—…ãƒã‚§ãƒƒã‚¯" />
              <div style={{ backgroundColor: '#FDF8F3', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
                <p style={{ fontSize: '13px', color: '#5D5D5D', margin: 0, lineHeight: 1.6 }}>æ„›çŠ¬ãƒ»æ„›çŒ«ã®æ­¯ã®å†™çœŸã‚’æ’®å½±ã—ã¦ã€AIãŒæ­¯å‘¨ç—…ã®å¯èƒ½æ€§ã‚’ãƒã‚§ãƒƒã‚¯ã—ã¾ã™ã€‚</p>
              </div>
              
              <input type="file" accept="image/*,.heic,.heif" ref={fileInputRef} onChange={handleImageSelect} style={{ display: 'none' }} />
              
              {imageConverting ? (
                <div style={{ textAlign: 'center', padding: '32px 20px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', color: '#5D5D5D', marginBottom: '8px' }}>ç”»åƒã‚’å¤‰æ›ã—ã¦ã„ã¾ã™...</div>
                  <div style={{ height: '6px', backgroundColor: '#E8E0D5', borderRadius: '3px', overflow: 'hidden' }}>
                    <div className="wept-loading-bar" style={{ height: '100%', backgroundColor: '#8B6B5C', borderRadius: '3px' }} />
                  </div>
                </div>
              ) : !imagePreview ? (
                <button onClick={() => fileInputRef.current?.click()} style={{ ...s.btn, padding: '32px 20px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>ðŸ“·</div>
                  <div style={{ fontSize: '13px', color: '#5D5D5D' }}>å†™çœŸã‚’é¸æŠž</div>
                </button>
              ) : (
                <div style={{ marginBottom: '16px' }}>
                  <img src={imagePreview} alt="é¸æŠžã—ãŸç”»åƒ" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { setSelectedImage(null); setImagePreview(null); }} style={{ ...s.btnSecondary, flex: 1 }} disabled={isLoading}>æ’®ã‚Šç›´ã™</button>
                    <button onClick={analyzePhoto} disabled={isLoading} style={{ ...s.btnPrimary, flex: 1, opacity: isLoading ? 0.7 : 1 }}>
                      {isLoading ? 'åˆ†æžä¸­...' : 'ãƒã‚§ãƒƒã‚¯ã™ã‚‹'}
                    </button>
                  </div>
                  
                  {/* ãƒ­ãƒ¼ãƒ‡ã‚£ãƒ³ã‚°GIFã‚¢ãƒ‹ãƒ¡ */}
                  {isLoading && (
                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                      {typeof WEPT_CONFIG !== 'undefined' && WEPT_CONFIG.assetsUrl ? (
                        <img
                          src={`${WEPT_CONFIG.assetsUrl}/loading-animation.gif`}
                          alt="åˆ†æžä¸­..."
                          style={{ width: '320px', maxWidth: '100%', height: 'auto' }}
                        />
                      ) : (
                        <div style={{ height: '8px', backgroundColor: '#E8E0D5', borderRadius: '4px', overflow: 'hidden' }}>
                          <div className="wept-loading-bar" style={{ height: '100%', backgroundColor: '#8B6B5C', borderRadius: '4px' }} />
                        </div>
                      )}
                      <div style={{ fontSize: '12px', color: '#5D5D5D', marginTop: '8px' }}>
                        AIãŒç”»åƒã‚’åˆ†æžã—ã¦ã„ã¾ã™...
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div style={{ backgroundColor: '#F5EDE4', borderRadius: '8px', padding: '12px' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '6px' }}>æ’®å½±ã®ã‚³ãƒ„</p>
                <ul style={{ fontSize: '11px', color: '#5D5D5D', margin: 0, paddingLeft: '16px', lineHeight: 1.6 }}>
                  <li>æ˜Žã‚‹ã„å ´æ‰€ã§æ’®å½±</li>
                  <li>æ­¯ã¨æ­¯èŒŽãŒã¯ã£ãã‚Šè¦‹ãˆã‚‹ã‚ˆã†ã«</li>
                  <li>ãƒ–ãƒ¬ãªã„ã‚ˆã†ã«å›ºå®šã—ã¦æ’®å½±</li>
                </ul>
              </div>
              
              <p style={{ fontSize: '11px', color: '#A69B8D', marginTop: '12px' }}>â€»ã“ã®çµæžœã¯ç›®å®‰ã§ã™ã€‚æ­£ç¢ºãªè¨ºæ–­ã¯ç£åŒ»å¸«ã«ã”ç›¸è«‡ãã ã•ã„ã€‚</p>
            </>
          )}

          {/* ===== photo-result ===== */}
          {currentView === "photo-result" && diagnosisResult && (() => {
            const confNum = parseFloat(String(diagnosisResult.confidence));
            const isLowConf = isNaN(confNum) || confNum <= 60;
            return isLowConf ? (
            <>
              <Header title="ãƒã‚§ãƒƒã‚¯çµæžœ" />
              {imagePreview && (
                <img src={imagePreview} alt="" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px' }} />
              )}
              <div style={{ backgroundColor: '#FFF8E1', borderRadius: '12px', padding: '16px', marginBottom: '16px', border: '1px solid #FFE082' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#E65100', marginBottom: '8px' }}>撮り直しをおすすめします</div>
                <p style={{ fontSize: '13px', color: '#5D5D5D', lineHeight: 1.6, marginBottom: '12px' }}>写真が鮮明でないか、歯が十分に写っていない可能性があります。明るい場所で、歯と歯ぐきが見えるように撮影してください。</p>
                <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '12px', border: '1px solid #FFE082' }}>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#8B6B5C', marginBottom: '4px' }}>撮影のコツ</p>
                  <p style={{ fontSize: '12px', color: '#5D5D5D', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{"・明るい場所で撮影する\n・唇をめくって歯全体を見せる\n・ブレないように固定する"}</p>
                </div>
              </div>
              <button onClick={() => { setDiagnosisResult(null); setCurrentView('photo-check'); }} style={s.btnPrimary}>もう一度撮影する</button>
              <button onClick={backToMenu} style={{ ...s.btnSecondary, marginTop: '8px' }}>TOPに戻る</button>
            </>
            ) : (
            <>
              <Header title="ãƒã‚§ãƒƒã‚¯çµæžœ" />
              
              {imagePreview && (
                <img src={imagePreview} alt="è¨ºæ–­ã—ãŸç”»åƒ" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px' }} />
              )}
              
              <div style={{ backgroundColor: '#FDF8F3', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '8px' }}>{diagnosisResult.prediction}</div>
                <div style={{ display: 'inline-block', fontSize: '11px', backgroundColor: '#E8E0D5', color: '#5D4E4E', padding: '4px 8px', borderRadius: '4px', marginBottom: '12px' }}>ä¿¡é ¼åº¦: {diagnosisResult.confidence}</div>
                <p style={{ fontSize: '13px', color: '#5D5D5D', marginBottom: '12px', lineHeight: 1.6 }}>{diagnosisResult.reason}</p>
                <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '12px', border: '1px solid #E8E0D5' }}>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#8B6B5C', marginBottom: '4px' }}>ã‚¢ãƒ‰ãƒã‚¤ã‚¹</p>
                  <p style={{ fontSize: '13px', color: '#5D5D5D', margin: 0, lineHeight: 1.6 }}>{diagnosisResult.advice}</p>
                </div>
              </div>
              
              <button onClick={backToMenu} style={s.btnPrimary}>TOPã«æˆ»ã‚‹</button>
            </>
            );
          })()}

          {/* ===== breath-check ===== */}
          {currentView === "breath-check" && (
            <>
              <Header title="å£è‡­ã®åŽŸå› ã‚»ãƒ«ãƒ•ãƒã‚§ãƒƒã‚¯" />
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#A69B8D', marginBottom: '6px' }}>
                  <span>è³ªå• {breathStep + 1} / {BREATH_QUESTIONS.length}</span>
                  <span>{Math.round((breathStep + 1) / BREATH_QUESTIONS.length * 100)}%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#E8E0D5', borderRadius: '3px' }}>
                  <div style={{ height: '100%', width: `${(breathStep + 1) / BREATH_QUESTIONS.length * 100}%`, backgroundColor: '#8B6B5C', borderRadius: '3px', transition: 'width 0.3s' }} />
                </div>
              </div>
              
              <p style={{ fontSize: '15px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '16px', lineHeight: 1.5 }}>
                {BREATH_QUESTIONS[breathStep].question}
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {BREATH_QUESTIONS[breathStep].options.map((option, idx) => (
                  <button key={idx} onClick={() => handleBreathAnswer(option.value)} style={{ ...s.btn, textAlign: 'left', padding: '14px 16px' }}>
                    <span style={{ fontSize: '13px', color: '#5D5D5D' }}>{option.label}</span>
                  </button>
                ))}
              </div>
              
              {breathStep > 0 && (
                <button onClick={() => setBreathStep(breathStep - 1)} style={{ ...s.btnSecondary, marginTop: '16px' }}>â† å‰ã®è³ªå•ã«æˆ»ã‚‹</button>
              )}
            </>
          )}

          {/* ===== breath-result ===== */}
          {currentView === "breath-result" && breathResult && (
            <>
              <Header title="ãƒã‚§ãƒƒã‚¯çµæžœ" />
              
              <div style={{ backgroundColor: '#FDF8F3', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '12px' }}>{breathResult.title}</div>
                <p style={{ fontSize: '13px', color: '#5D5D5D', marginBottom: '16px', lineHeight: 1.6 }}>{breathResult.comment}</p>
                
                <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#8B6B5C', marginBottom: '8px' }}>ç¢ºèªã—ã¦ãŠããŸã„ã“ã¨</p>
                  {breathResult.tips.map((tip, idx) => (
                    <p key={idx} style={{ fontSize: '12px', color: '#5D5D5D', marginBottom: '6px', lineHeight: 1.5 }}>ãƒ»{tip}</p>
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '8px' }}>é–¢é€£ã™ã‚‹è¨˜äº‹</p>
                {breathResult.articles.map((article, idx) => (
                  <a key={idx} href={article.url} target="_blank" rel="noreferrer" style={{ display: 'block', backgroundColor: '#fff', border: '1px solid #E8DDD3', borderRadius: '8px', padding: '10px 12px', marginBottom: '6px', textDecoration: 'none' }}>
                    <span style={{ fontSize: '13px', color: '#5D5D5D' }}>{article.title}</span>
                  </a>
                ))}
              </div>
              
              <button onClick={backToMenu} style={s.btnPrimary}>TOPã«æˆ»ã‚‹</button>
            </>
          )}

          {/* ===== dental-lp ===== */}
          {currentView === "dental-lp" && (() => {
            const dlpPage = DENTAL_LP_PAGES[dentalLpPage];
            return (
            <>
              <Header title="å½“é™¢ã®æ­¯ç§‘æ²»ç™‚" />
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '12px' }}>
                {DENTAL_LP_PAGES.map((_, idx) => (
                  <button key={idx} onClick={() => setDentalLpPage(idx)} style={{ width: '8px', height: '8px', borderRadius: '50%', border: 'none', backgroundColor: dentalLpPage === idx ? '#8B6B5C' : '#D4C9BC', cursor: 'pointer', padding: 0 }} />
                ))}
              </div>
              <div style={{ minHeight: '240px' }}>

                {/* hero */}
                {dlpPage.type === 'hero' && (
                  <>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#8B6B5C', letterSpacing: '0.5px', marginBottom: '4px' }}>{dlpPage.topLine}</div>
                    <div style={{ fontSize: '17px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '10px', lineHeight: 1.5 }}>{dlpPage.title}</div>
                    <div style={{ width: '100%', height: '120px', borderRadius: '12px', marginBottom: '14px', overflow: 'hidden', backgroundColor: '#F5EDE4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#A69B8D' }}>ðŸ¦· æ­¯ç§‘æ²»ç™‚ã®æ§˜å­</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#8B7B6B', marginBottom: '14px', lineHeight: 1.6 }}>{dlpPage.subtitle}</p>
                    <div style={{ backgroundColor: '#FDF8F3', borderRadius: '12px', padding: '12px', border: '1px solid #E8DDD3' }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#8B6B5C', marginBottom: '8px' }}>å¯¾å¿œã§ãã‚‹æ²»ç™‚</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {dlpPage.tags.map((tag, i) => (
                          <span key={i} style={{ fontSize: '12px', fontWeight: 500, color: '#5D4E4E', backgroundColor: '#fff', border: '1px solid #E8DDD3', borderRadius: '9999px', padding: '4px 12px' }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* why */}
                {dlpPage.type === 'why' && (
                  <>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '12px' }}>{dlpPage.title}</div>
                    {dlpPage.columns.map((col, i) => (
                      <div key={i} style={{ backgroundColor: '#FDF8F3', borderRadius: '8px', padding: '10px', marginBottom: '8px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#8B6B5C' }}>{col.label}</div>
                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#5D4E4E' }}>{col.title}</div>
                        <div style={{ fontSize: '11px', color: '#8B7B6B' }}>{col.desc}</div>
                      </div>
                    ))}
                    <p style={{ fontSize: '13px', color: '#5D4E4E', textAlign: 'center', marginTop: '8px' }}>{dlpPage.conclusion}</p>
                  </>
                )}

                {/* cases (Before/After) */}
                {dlpPage.type === 'cases' && (
                  <>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '12px' }}>{dlpPage.title}</div>
                    {dlpPage.cases.map((c, i) => (
                      <div key={i} style={{ backgroundColor: '#fff', border: '1px solid #E8E0D5', borderRadius: '8px', padding: '10px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                          <div style={{ flex: 1, borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                            <div style={{ height: '60px', backgroundColor: '#F5EDE4', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#A69B8D' }}>Before</div>
                            <div style={{ position: 'absolute', top: '4px', left: '4px', fontSize: '9px', backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', padding: '1px 6px', borderRadius: '4px' }}>Before</div>
                          </div>
                          <div style={{ flex: 1, borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                            <div style={{ height: '60px', backgroundColor: '#E8F5E9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#4CAF50' }}>After</div>
                            <div style={{ position: 'absolute', top: '4px', left: '4px', fontSize: '9px', backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', padding: '1px 6px', borderRadius: '4px' }}>After</div>
                          </div>
                        </div>
                        <p style={{ fontSize: '12px', color: '#5D5D5D', margin: '0 0 6px 0', lineHeight: 1.5 }}>{c.desc}</p>
                        <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#8B6B5C', fontWeight: 500, textDecoration: 'none' }}>
                          {c.urlLabel} â†’
                        </a>
                      </div>
                    ))}
                    <p style={{ fontSize: '11px', color: '#A69B8D', textAlign: 'center' }}>{dlpPage.note}</p>
                    <a href="https://kinswith-vet.com/case_list/" target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', fontSize: '13px', fontWeight: 500, color: '#8B6B5C', backgroundColor: '#FDF8F3', border: '1px solid #E8DDD3', borderRadius: '10px', padding: '10px', marginTop: '8px', textDecoration: 'none', cursor: 'pointer' }}>
                      ä»–ã®ç—‡ä¾‹ã‚’è¦‹ã‚‹
                    </a>
                  </>
                )}

                {/* equipment */}
                {dlpPage.type === 'equipment' && (
                  <>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '8px' }}>{dlpPage.title}</div>
                    <p style={{ fontSize: '12px', color: '#8B7B6B', marginBottom: '12px' }}>{dlpPage.subtitle}</p>
                    {dlpPage.points.map((p, i) => <div key={i} style={{ fontSize: '13px', color: '#5D5D5D', marginBottom: '6px' }}>{i+1}. {p}</div>)}
                    <p style={{ fontSize: '11px', color: '#A69B8D', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #E8E0D5' }}>{dlpPage.note}</p>
                  </>
                )}

                {/* doctor */}
                {dlpPage.type === 'doctor' && (
                  <>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '12px' }}>{dlpPage.title}</div>
                    <div style={{ backgroundColor: '#FDF8F3', borderRadius: '12px', padding: '14px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#E8E0D5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#8B7B6B', flexShrink: 0 }}>Dr</div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#5D4E4E' }}>{dlpPage.profile.name}</div>
                          <div style={{ fontSize: '11px', color: '#8B7B6B' }}>{dlpPage.profile.role}</div>
                          <div style={{ fontSize: '10px', color: '#A69B8D' }}>{dlpPage.profile.affiliation}</div>
                        </div>
                      </div>
                      <p style={{ fontSize: '13px', color: '#5D5D5D', fontStyle: 'italic', margin: 0 }}>ã€Œ{dlpPage.profile.stance}ã€</p>
                    </div>
                    {dlpPage.points.map((p, i) => <div key={i} style={{ fontSize: '13px', color: '#5D5D5D', marginBottom: '6px' }}>ãƒ»{p}</div>)}
                  </>
                )}

                {/* voices */}
                {dlpPage.type === 'voices' && (
                  <>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '12px' }}>{dlpPage.title}</div>
                    {dlpPage.voices.map((v, i) => (
                      <div key={i} style={{ backgroundColor: '#fff', border: '1px solid #E8E0D5', borderRadius: '8px', padding: '10px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '10px', backgroundColor: '#F5EDE4', color: '#8B6B5C', padding: '2px 8px', borderRadius: '9999px' }}>{v.tag}</span>
                        <p style={{ fontSize: '13px', color: '#5D5D5D', margin: '8px 0 0 0' }}>ã€Œ{v.text}ã€</p>
                      </div>
                    ))}
                    <p style={{ fontSize: '13px', color: '#5D4E4E', textAlign: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E8E0D5' }}>{dlpPage.conclusion}</p>
                  </>
                )}

              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                {dentalLpPage > 0 && <button onClick={() => setDentalLpPage(dentalLpPage - 1)} style={{ ...s.btnSecondary, flex: 1 }}>â† å‰ã¸</button>}
                {dentalLpPage < DENTAL_LP_PAGES.length - 1 ? (
                  <button onClick={() => setDentalLpPage(dentalLpPage + 1)} style={{ ...s.btnPrimary, flex: 1 }}>æ¬¡ã¸ â†’</button>
                ) : (
                  <button onClick={backToMenu} style={{ ...s.btnPrimary, flex: 1 }}>TOPã«æˆ»ã‚‹</button>
                )}
              </div>
            </>
            );
          })()}

          {/* ===== flow-lp ===== */}
          {currentView === "flow-lp" && (
            <>
              <Header title="æ­¯ç§‘æ²»ç™‚ã®æµã‚Œ" />
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '8px', flexWrap: 'wrap' }}>
                {(FLOW_LP_PAGES[flowLpPage].flowType === 'main' ? ['äºˆç´„', 'åˆè¨º', 'æ¤œæŸ»', 'å†è¨º'] : ['æ‰‹è¡“', 'æ¤œè¨º']).map((step, idx) => {
                  const isActive = FLOW_LP_PAGES[flowLpPage].flowType === 'main' ? flowLpPage === idx : (flowLpPage === 4 && idx === 0) || (flowLpPage === 5 && idx === 1);
                  return (
                    <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '9999px', backgroundColor: isActive ? '#8B6B5C' : '#F5EDE4', color: isActive ? '#fff' : '#8B7B6B' }}>{step}</span>
                      {idx < (FLOW_LP_PAGES[flowLpPage].flowType === 'main' ? 3 : 1) && <span style={{ margin: '0 2px', color: '#D4C9BC' }}>â†’</span>}
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '12px' }}>
                {FLOW_LP_PAGES.map((_, idx) => (
                  <button key={idx} onClick={() => setFlowLpPage(idx)} style={{ width: '8px', height: '8px', borderRadius: '50%', border: 'none', backgroundColor: flowLpPage === idx ? '#8B6B5C' : '#D4C9BC', cursor: 'pointer', padding: 0 }} />
                ))}
              </div>
              <div style={{ minHeight: '200px' }}>
                <span style={{ fontSize: '11px', backgroundColor: '#F5EDE4', color: '#8B6B5C', padding: '4px 10px', borderRadius: '9999px' }}>{FLOW_LP_PAGES[flowLpPage].step}</span>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#5D4E4E', margin: '10px 0 8px' }}>{FLOW_LP_PAGES[flowLpPage].title}</div>
                <div style={{ backgroundColor: '#FDF8F3', borderRadius: '12px', padding: '14px', marginBottom: '12px' }}>
                  <p style={{ fontSize: '13px', color: '#5D5D5D', whiteSpace: 'pre-line', margin: 0, lineHeight: 1.6 }}>{FLOW_LP_PAGES[flowLpPage].body}</p>
                </div>
                <p style={{ fontSize: '11px', color: '#A69B8D' }}>â€» {FLOW_LP_PAGES[flowLpPage].note}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                {flowLpPage > 0 && <button onClick={() => setFlowLpPage(flowLpPage - 1)} style={{ ...s.btnSecondary, flex: 1 }}>â† å‰ã¸</button>}
                {flowLpPage < FLOW_LP_PAGES.length - 1 ? (
                  <button onClick={() => setFlowLpPage(flowLpPage + 1)} style={{ ...s.btnPrimary, flex: 1 }}>æ¬¡ã¸ â†’</button>
                ) : (
                  <button onClick={backToMenu} style={{ ...s.btnPrimary, flex: 1 }}>TOPã«æˆ»ã‚‹</button>
                )}
              </div>
            </>
          )}

          {/* ===== brushing-lp ===== */}
          {currentView === "brushing-lp" && (() => {
            const bp = BRUSHING_LP_PAGES[brushingPage];
            const displayName = petName || 'ã‚ãªãŸã®æ„›çŠ¬';

            const handleClear = (ci) => {
              setShowReward({ pet: brushingRandomPick(bp.rewards.pet), owner: brushingRandomPick(bp.rewards.owner) });
              setClearedSteps(prev => new Set([...prev, ci]));
            };
            const handleBrushingExit = () => {
              setBrushingExitMsg(brushingReplaceName(brushingRandomPick(BRUSHING_EXIT_MESSAGES), petName));
              setShowBrushingExit(true);
            };
            const closeReward = () => {
              setShowReward(null);
              if (brushingPage < BRUSHING_LP_PAGES.length - 1) setBrushingPage(brushingPage + 1);
            };

            const renderProductCard = (p, i) => (
              <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#fff', border: '1px solid #E8DDD3', borderRadius: '12px', padding: '10px', marginBottom: '8px', textDecoration: 'none' }}>
                <div style={{ width: '64px', height: '64px', minWidth: '64px', borderRadius: '8px', backgroundColor: '#F5EDE4', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span style="font-size:10px;color:#A69B8D">No img</span>'; }} />
                  ) : (
                    <span style={{ fontSize: '10px', color: '#A69B8D' }}>æº–å‚™ä¸­</span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '3px' }}>{p.name}</div>
                  <div style={{ fontSize: '11px', color: '#8B7B6B', marginBottom: '4px' }}>{p.desc}</div>
                  <div style={{ fontSize: '11px', color: '#8B6B5C', fontWeight: 500 }}>è©³ã—ãè¦‹ã‚‹ â†’</div>
                </div>
              </a>
            );

            return (
            <>
              <Header title="æ­¯ç£¨ãã‚¬ã‚¤ãƒ‰" />

              {/* ãƒ—ãƒ­ã‚°ãƒ¬ã‚¹ãƒãƒ¼ */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#A69B8D', marginBottom: '4px' }}>
                  <span>é”æˆåº¦</span>
                  <span>{clearedSteps.size} / {BRUSHING_TOTAL}</span>
                </div>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {Array.from({ length: BRUSHING_TOTAL }, (_, i) => (
                    <div key={i} style={{ flex: 1, height: '6px', borderRadius: '3px', backgroundColor: clearedSteps.has(i) ? '#8B6B5C' : '#E8E0D5', transition: 'background-color 0.3s' }} />
                  ))}
                </div>
              </div>

              {/* ãƒ‰ãƒƒãƒˆã‚¤ãƒ³ã‚¸ã‚±ãƒ¼ã‚¿ãƒ¼ */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '12px' }}>
                {BRUSHING_LP_PAGES.map((_, idx) => (
                  <button key={idx} onClick={() => setBrushingPage(idx)} style={{ width: '7px', height: '7px', borderRadius: '50%', border: 'none', backgroundColor: brushingPage === idx ? '#8B6B5C' : '#D4C9BC', cursor: 'pointer', padding: 0 }} />
                ))}
              </div>

              <div style={{ minHeight: '240px' }}>

                {/* ===== intro ===== */}
                {bp.type === 'intro' && (
                  <div style={{ animation: 'fadeInUp 0.4s ease' }}>
                    <BrushingStepImage src={bp.image} alt="æ­¯ç£¨ãã‚¬ã‚¤ãƒ‰" />
                    <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '6px' }}>{bp.title}</div>
                      <div style={{ fontSize: '14px', color: '#8B7B6B' }}>{bp.subtitle}</div>
                    </div>
                    <div style={{ backgroundColor: '#FDF8F3', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
                      <p style={{ fontSize: '13px', color: '#5D5D5D', whiteSpace: 'pre-line', margin: 0, lineHeight: 1.7 }}>{bp.body}</p>
                    </div>
                    <div style={{ backgroundColor: '#fff', border: '1px solid #E8DDD3', borderRadius: '12px', padding: '14px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#8B6B5C', display: 'block', marginBottom: '8px' }}>æ„›çŠ¬ã®åå‰ï¼ˆä»»æ„ï¼‰</label>
                      <input type="text" value={petName} onChange={(e) => setPetName(e.target.value)} placeholder="ä¾‹ï¼šãƒãƒã€ã‚¸ãƒ§ãƒ³"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E8DDD3', backgroundColor: '#FDF8F3', fontSize: '14px', color: '#5D4E4E', outline: 'none', boxSizing: 'border-box' }}
                      />
                      <p style={{ fontSize: '11px', color: '#A69B8D', margin: '6px 0 0' }}>å…¥åŠ›ã™ã‚‹ã¨ã€ã¡ã‚‡ã£ã¨å¬‰ã—ã„ã“ã¨ãŒã‚ã‚Šã¾ã™</p>
                    </div>
                  </div>
                )}

                {/* ===== prep ===== */}
                {bp.type === 'prep' && (
                  <div style={{ animation: 'fadeInUp 0.4s ease' }}>
                    <div style={{ fontSize: '17px', fontWeight: 'bold', color: '#5D4E4E', margin: '0 0 12px', lineHeight: 1.4 }}>{bp.title}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                      {bp.prepItems.map((item, i) => (
                        <div key={i} style={{ backgroundColor: '#FDF8F3', borderRadius: '12px', padding: '14px', border: '1px solid #E8DDD3' }}>
                          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '8px' }}>{item.name}</div>
                          {item.points.map((pt, j) => (
                            <div key={j} style={{ fontSize: '11px', color: '#5D5D5D', marginBottom: '3px', lineHeight: 1.5 }}>ãƒ»{pt}</div>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div style={{ backgroundColor: '#FDF8F3', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
                      <p style={{ fontSize: '13px', color: '#5D5D5D', whiteSpace: 'pre-line', margin: 0, lineHeight: 1.7 }}>{bp.body}</p>
                    </div>
                    {bp.products && (
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#8B6B5C', marginBottom: '8px' }}>KINSã®ãŠæ°—ã«å…¥ã‚Š</p>
                        {bp.products.map(renderProductCard)}
                      </div>
                    )}
                  </div>
                )}

                {/* ===== vetCheck ===== */}
                {bp.type === 'vetCheck' && (
                  <div style={{ animation: 'fadeInUp 0.4s ease' }}>
                    <span style={{ display: 'inline-block', fontSize: '12px', backgroundColor: '#5D4E4E', color: '#fff', padding: '5px 14px', borderRadius: '6px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '16px' }}>{bp.title}</span>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div style={{ width: '72px', minWidth: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#F5EDE4', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '10px', color: '#A69B8D' }}>PHOTO</span>
                      </div>
                      <div style={{ flex: 1, fontSize: '13px', color: '#5D5D5D', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                        {bp.body}
                      </div>
                    </div>
                  </div>
                )}

                {/* ===== challenge ===== */}
                {bp.type === 'challenge' && (
                  <div style={{ animation: 'fadeInUp 0.4s ease' }}>
                    {bp.image && <BrushingStepImage src={bp.image} alt={bp.title} />}
                    <span style={{ fontSize: '11px', backgroundColor: '#F5EDE4', color: '#8B6B5C', padding: '4px 10px', borderRadius: '9999px', fontWeight: 'bold' }}>{bp.step}</span>
                    <div style={{ fontSize: '17px', fontWeight: 'bold', color: '#5D4E4E', margin: '10px 0 10px', lineHeight: 1.4 }}>{bp.title}</div>
                    <div style={{ backgroundColor: '#FDF8F3', borderRadius: '12px', padding: '14px', marginBottom: '12px' }}>
                      <p style={{ fontSize: '13px', color: '#5D5D5D', whiteSpace: 'pre-line', margin: 0, lineHeight: 1.7 }}>{bp.body}</p>
                    </div>
                    {bp.tips && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                        {bp.tips.map((tip, i) => (
                          <span key={i} style={{ fontSize: '12px', color: '#5D5D5D', backgroundColor: '#F5EDE4', padding: '4px 12px', borderRadius: '9999px', whiteSpace: 'nowrap' }}>{tip}</span>
                        ))}
                      </div>
                    )}
                    {clearedSteps.has(bp.challengeIndex) ? (
                      <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#FDF8F3', borderRadius: '12px', border: '1px solid #E8DDD3' }}>
                        <span style={{ fontSize: '13px', color: '#8B6B5C', fontWeight: 'bold' }}>ã‚¯ãƒªã‚¢æ¸ˆã¿ï¼</span>
                      </div>
                    ) : (
                      <>
                        <button onClick={() => handleClear(bp.challengeIndex)} style={s.btnClear}>ã§ããŸï¼</button>
                        <div style={{ textAlign: 'center' }}>
                          <button onClick={handleBrushingExit} style={s.btnExit}>ä»Šæ—¥ã¯ã“ã“ã¾ã§ã«ã™ã‚‹</button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* ===== info ===== */}
                {bp.type === 'info' && (
                  <div style={{ animation: 'fadeInUp 0.4s ease' }}>
                    {bp.image && <BrushingStepImage src={bp.image} alt={bp.title} />}
                    <div style={{ fontSize: '17px', fontWeight: 'bold', color: '#5D4E4E', margin: '10px 0 10px', lineHeight: 1.4 }}>{bp.title}</div>
                    <div style={{ backgroundColor: '#FDF8F3', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
                      <p style={{ fontSize: '13px', color: '#5D5D5D', whiteSpace: 'pre-line', margin: 0, lineHeight: 1.7 }}>{bp.body}</p>
                    </div>
                    {bp.tips && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                        {bp.tips.map((tip, i) => (
                          <span key={i} style={{ fontSize: '12px', color: '#5D5D5D', backgroundColor: '#F5EDE4', padding: '4px 12px', borderRadius: '9999px', whiteSpace: 'nowrap' }}>{tip}</span>
                        ))}
                      </div>
                    )}
                    {bp.doctorNote && (
                      <div style={{ backgroundColor: '#fff', border: '1px solid #E8DDD3', borderRadius: '10px', padding: '12px' }}>
                        <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#965D57', marginBottom: '4px' }}>ç£åŒ»å¸«ã‚ˆã‚Š</p>
                        <p style={{ fontSize: '12px', color: '#5D5D5D', margin: 0, lineHeight: 1.6 }}>{bp.doctorNote}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ===== product ===== */}
                {bp.type === 'product' && (
                  <div style={{ animation: 'fadeInUp 0.4s ease' }}>
                    <div style={{ fontSize: '17px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '6px' }}>{bp.title}</div>
                    <p style={{ fontSize: '12px', color: '#8B7B6B', marginBottom: '14px' }}>{bp.subtitle}</p>
                    {bp.products.map(renderProductCard)}
                  </div>
                )}

                {/* ===== complete ===== */}
                {bp.type === 'complete' && (
                  <div style={{ animation: 'scaleIn 0.5s ease', textAlign: 'center', position: 'relative' }}>
                    {confetti.map(p => (
                      <div key={p.id} style={{
                        position: 'absolute', top: 0, left: `${p.left}%`,
                        width: `${p.size}px`, height: `${p.size}px`,
                        backgroundColor: p.color, borderRadius: p.size > 10 ? '50%' : '2px',
                        animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
                        transform: `rotate(${p.rotation}deg)`, opacity: 0, zIndex: 10,
                        pointerEvents: 'none',
                      }} />
                    ))}
                    <div style={{
                      backgroundColor: '#FDF8F3', borderRadius: '16px', padding: '24px 20px',
                      border: '2px solid #E8DDD3', boxShadow: '0 4px 20px rgba(139,107,92,0.12)',
                      marginBottom: '12px', position: 'relative', zIndex: 20,
                    }}>
                      <div style={{ fontSize: '12px', color: '#8B6B5C', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '12px' }}>BRUSHING CHALLENGE</div>
                      <div style={{ width: '40px', height: '2px', backgroundColor: '#965D57', margin: '0 auto 14px' }} />
                      <div style={{ fontSize: '16px', color: '#5D4E4E', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '20px' }}>{displayName}</span> ã®
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '14px' }}>æ­¯ç£¨ããƒãƒ£ãƒ¬ãƒ³ã‚¸ ã‚¯ãƒªã‚¢ï¼</div>
                      <div style={{ width: '40px', height: '2px', backgroundColor: '#965D57', margin: '0 auto 14px' }} />
                      <p style={{ fontSize: '13px', color: '#5D5D5D', lineHeight: 1.7, whiteSpace: 'pre-line', marginBottom: '16px' }}>
                        {brushingReplaceName(brushingRandomPick(bp.messages), petName)}
                      </p>
                      <div style={{ fontSize: '12px', color: '#A69B8D', marginBottom: '14px' }}>
                        {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div style={{ borderTop: '1px solid #E8DDD3', paddingTop: '12px' }}>
                        <img src={BRUSHING_LOGO_URL} alt="KINS WITH" style={{ height: '20px', margin: '0 auto 6px', display: 'block', objectFit: 'contain' }}
                          onError={(e) => { e.target.style.display = 'none'; }} />
                        <div style={{ fontSize: '10px', color: '#A69B8D' }}>çŠ¬ãƒ»çŒ«ã®æ­¯åŒ»è€…ã•ã‚“</div>
                      </div>
                    </div>
                    <p style={{ fontSize: '12px', color: '#A69B8D' }}>ã‚¹ã‚¯ã‚·ãƒ§ã—ã¦è¨˜å¿µã«æ®‹ãã†ï¼</p>
                  </div>
                )}

              </div>

              {/* ãƒŠãƒ“ã‚²ãƒ¼ã‚·ãƒ§ãƒ³ */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                {brushingPage > 0 && (
                  <button onClick={() => setBrushingPage(brushingPage - 1)} style={{ ...s.btnSecondary, flex: 1 }}>â† å‰ã¸</button>
                )}
                {brushingPage < BRUSHING_LP_PAGES.length - 1 ? (
                  <button onClick={() => setBrushingPage(brushingPage + 1)} style={{ ...s.btnPrimary, flex: 1 }}>æ¬¡ã¸ â†’</button>
                ) : (
                  <button onClick={backToMenu} style={{ ...s.btnPrimary, flex: 1 }}>TOPã«æˆ»ã‚‹</button>
                )}
              </div>

              {/* å ±é…¬ãƒ¢ãƒ¼ãƒ€ãƒ« */}
              {showReward && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
                  <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '320px', animation: 'scaleIn 0.3s ease', textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '16px' }}>ã‚„ã£ãŸã­ï¼</div>
                    <div style={{ backgroundColor: '#FDF8F3', borderRadius: '12px', padding: '14px', marginBottom: '10px', textAlign: 'left' }}>
                      <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#8B6B5C', marginBottom: '4px' }}>{displayName}ã¸</p>
                      <p style={{ fontSize: '13px', color: '#5D5D5D', margin: 0, lineHeight: 1.6 }}>{showReward.pet}</p>
                    </div>
                    <div style={{ backgroundColor: '#F5EDE4', borderRadius: '12px', padding: '14px', marginBottom: '16px', textAlign: 'left' }}>
                      <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#965D57', marginBottom: '4px' }}>é£¼ã„ä¸»ã•ã‚“ã¸</p>
                      <p style={{ fontSize: '13px', color: '#5D5D5D', margin: 0, lineHeight: 1.6 }}>{showReward.owner}</p>
                    </div>
                    <button onClick={closeReward} style={s.btnPrimary}>æ¬¡ã®ã‚¹ãƒ†ãƒƒãƒ—ã¸ â†’</button>
                  </div>
                </div>
              )}

              {/* é€”ä¸­é›¢è„±ãƒ¢ãƒ¼ãƒ€ãƒ« */}
              {showBrushingExit && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
                  <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '320px', animation: 'scaleIn 0.3s ease', textAlign: 'center' }}>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '12px' }}>ãŠã¤ã‹ã‚Œã•ã¾</div>
                    <p style={{ fontSize: '13px', color: '#5D5D5D', lineHeight: 1.7, marginBottom: '16px' }}>{brushingExitMsg}</p>
                    <button onClick={() => { setShowBrushingExit(false); backToMenu(); }} style={s.btnPrimary}>ãƒ¡ãƒ‹ãƒ¥ãƒ¼ã«æˆ»ã‚‹</button>
                  </div>
                </div>
              )}
            </>
            );
          })()}

          {/* ===== article-summary ===== */}
          {currentView === "article-summary" && (() => {
            const journalKey = getJournalKey();
            const article = journalKey ? getArticleByKey(journalKey) : null;

            if (!article) {
              return (
                <>
                  <Header title="è¨˜äº‹ã®ã¾ã¨ã‚" />
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <p style={{ fontSize: '14px', color: '#5D5D5D', marginBottom: '16px' }}>ã“ã®è¨˜äº‹ã®è¦ç´„ãƒ‡ãƒ¼ã‚¿ãŒè¦‹ã¤ã‹ã‚Šã¾ã›ã‚“ã§ã—ãŸã€‚</p>
                    <button onClick={backToMenu} style={s.btnPrimary}>TOPã«æˆ»ã‚‹</button>
                  </div>
                </>
              );
            }

            // summary ã‚’æ–‡å­—åˆ—ã«æ•´å½¢
            let summaryText = '';
            if (typeof article.summary === 'object' && article.summary !== null) {
              summaryText = Object.entries(article.summary)
                .filter(([_, v]) => v)
                .map(([k, v]) => `ã€${k}ã€‘\n${v}`)
                .join('\n\n');
            } else if (typeof article.summary === 'string') {
              summaryText = article.summary;
            }

            const labels = article.labels || [];

            return (
              <>
                <Header title="è¨˜äº‹ã®ã¾ã¨ã‚" />
                {/* è¨˜äº‹ã‚¿ã‚¤ãƒˆãƒ« */}
                <div style={{ backgroundColor: '#FDF8F3', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#5D4E4E', margin: 0, lineHeight: 1.5 }}>ðŸ“„ {article.title}</p>
                </div>

                {/* è¦ç´„ãƒ†ã‚­ã‚¹ãƒˆ */}
                {summaryText && (
                  <div style={{ backgroundColor: '#fff', border: '1px solid #E8E0D5', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
                    <p style={{ fontSize: '13px', color: '#5D5D5D', whiteSpace: 'pre-line', margin: 0, lineHeight: 1.7 }}>{summaryText}</p>
                  </div>
                )}

                {/* ãƒ©ãƒ™ãƒ«ï¼ˆã‚¢ãƒ³ã‚«ãƒ¼ãƒªãƒ³ã‚¯ï¼‰ */}
                {labels.length > 0 && (
                  <div style={{ marginBottom: '14px' }}>
                    <p style={{ fontSize: '12px', color: '#8B7B6B', marginBottom: '8px', fontWeight: 'bold' }}>æ°—ã«ãªã‚‹ãƒã‚¤ãƒ³ãƒˆ</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {labels.map((label, idx) => (
                        <a
                          key={idx}
                          href={article.url + (label.anchor || '')}
                          target="_top"
                          onClick={() => trackEvent('wept_label_click', { label_text: label.text, article_key: journalKey })}
                          style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '9999px', backgroundColor: '#F5EDE4', color: '#5D4E4E', textDecoration: 'none', border: '1px solid #E8DDD3' }}
                        >
                          {label.text}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* è¨˜äº‹ãƒªãƒ³ã‚¯ */}
                <a href={article.url} target="_top" style={{ display: 'block', textDecoration: 'none', marginBottom: '10px' }} onClick={() => trackEvent('wept_article_fullread', { article_key: journalKey, article_title: article.title })}>
                  <div style={{ ...s.btnPrimary, textAlign: 'center' }}>è¨˜äº‹ã®å…¨æ–‡ã‚’èª­ã‚€ â†’</div>
                </a>

                <button onClick={backToMenu} style={s.btnSecondary}>TOPã«æˆ»ã‚‹</button>
              </>
            );
          })()}

          {/* ===== chat ===== */}
          {currentView === "chat" && (
            <>
              <Header title="ç›¸è«‡ä¸­" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {messages.map((msg, index) => (
                  <div key={index}>
                    <div style={{ display: 'flex', justifyContent: msg.type === "user" ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth: '85%', padding: '10px 12px', borderRadius: '16px', borderBottomRightRadius: msg.type === "user" ? '4px' : '16px', borderBottomLeftRadius: msg.type === "user" ? '16px' : '4px', fontSize: '13px', whiteSpace: 'pre-wrap', lineHeight: 1.5, backgroundColor: msg.type === "user" ? '#8B6B5C' : '#F5EDE4', color: msg.type === "user" ? '#FFFFFF' : '#3D3D3D' }}>
                        {msg.text}
                      </div>
                    </div>
                    {msg.articles?.length > 0 && (
                      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <p style={{ fontSize: '11px', color: '#8B7B6B', margin: 0 }}>ãŠã™ã™ã‚ã®è¨˜äº‹</p>
                        {msg.articles.map((article, idx) => (
                          <a key={idx} href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }} onClick={() => trackEvent('wept_article_click', { article_url: article.url, article_title: article.title })}>
                            <div style={{ width: '100%', textAlign: 'left', padding: '10px', borderRadius: '10px', backgroundColor: '#FFF9F5', border: '1px solid #E8DDD3', cursor: 'pointer' }}>
                              <p style={{ fontSize: '13px', fontWeight: 500, color: '#3D3D3D', margin: '0 0 2px 0' }}>{article.title}</p>
                              <p style={{ fontSize: '11px', color: '#8B7B6B', margin: 0 }}>{article.reason}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{ padding: '10px 12px', borderRadius: '16px', borderBottomLeftRadius: '4px', backgroundColor: '#F5EDE4' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[0, 1, 2].map(i => <span key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#8B6B5C', display: 'inline-block', animation: 'weptDotBounce 1.2s infinite', animationDelay: `${i * 0.2}s` }} />)}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </>
          )}
        </div>

        {/* chatæ™‚ã®ãƒ•ãƒƒã‚¿ãƒ¼ */}
        {currentView === "chat" && (
          <div className="wept-footer">
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.nativeEvent.isComposing && handleSend()} placeholder="ç¶šã‘ã¦è³ªå•..." className="wept-input" />
            <button onClick={handleSend} disabled={!inputValue.trim()} style={{ ...s.send, opacity: !inputValue.trim() ? 0.5 : 1 }}>â†‘</button>
          </div>
        )}
      </aside>
    </div>
  );
}

// mount
(function mount() {
  const el = document.getElementById("webpilot-root");
  if (!el) return;
  const root = ReactDOM.createRoot ? ReactDOM.createRoot(el) : null;
  if (root) {
    root.render(<WebpilotChat />);
  } else {
    ReactDOM.render(<WebpilotChat />, el);
  }
})();
