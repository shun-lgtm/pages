/* global React, ReactDOM */
const { useState, useEffect, useRef } = React;

// 口臭チェック質問データ
const BREATH_QUESTIONS = [
  { id: 'q1', question: '口臭のタイプは？', options: [
    { value: 'A', label: '腐敗臭（生ゴミっぽい）' },
    { value: 'B', label: 'アンモニア・尿っぽい' },
    { value: 'C', label: '酸っぱい' },
    { value: 'D', label: 'うんちっぽい' }
  ]},
  { id: 'q2', question: 'ぐったりしていますか？', options: [{ value: 'yes', label: 'はい' }, { value: 'no', label: 'いいえ' }] },
  { id: 'q3', question: '嘔吐はありますか？', options: [{ value: 'yes', label: 'はい' }, { value: 'no', label: 'いいえ' }] },
  { id: 'q4', question: '下痢はありますか？', options: [{ value: 'yes', label: 'はい' }, { value: 'no', label: 'いいえ' }] },
  { id: 'q5', question: '便通がない状態ですか？', options: [{ value: 'yes', label: 'はい' }, { value: 'no', label: 'いいえ' }] },
  { id: 'q6', question: '水をたくさん飲む・おしっこが多いですか？', options: [{ value: 'yes', label: 'はい' }, { value: 'no', label: 'いいえ' }] },
  { id: 'q7', question: '口を痛がる様子がありますか？', options: [{ value: 'yes', label: 'はい' }, { value: 'no', label: 'いいえ' }] }
];

// 口臭チェック結果辞書
const BREATH_CONTENT = {
  A: {
    title: '腐敗臭（歯周系）',
    comment: '腐敗臭は、口の中の炎症（歯周トラブル）が関係していることがあります。進行するとつらさが増えやすいので、できるだけ早めに状態を確認してあげてください。',
    tips: ['歯ぐきの赤み・出血、歯石の付き方を一度だけ確認してみてください。', '口を触られるのを嫌がる／片側で噛む様子があれば、無理に口を開けようとしなくて大丈夫です。'],
    articles: [{ url: 'https://kinswith-vet.com/journal/1234/', title: '歯周病の解説' }, { url: 'https://kinswith-vet.com/journal/2810/', title: '歯周病の症例' }, { url: 'https://kinswith-vet.com/journal/868/', title: '口臭まとめ' }]
  },
  B: {
    title: 'アンモニア臭（全身系）',
    comment: 'アンモニア臭は、お口だけでなく体の状態（腎臓など）が関係する可能性があります。続く場合は"念のため"の確認が安心につながります。',
    tips: ['口の中だけでなく、元気・食欲・水を飲む量の変化がないかを一緒に見てください。', 'もし嘔吐や下痢、ぐったりが重なる場合は、口臭より"体調の変化"を優先して考えるのが安心です。'],
    articles: [{ url: 'https://kinswith-vet.com/journal/1044/', title: '腎不全の解説' }, { url: 'https://kinswith-vet.com/journal/3409/', title: '抜歯症例' }, { url: 'https://kinswith-vet.com/journal/868/', title: '口臭まとめ' }]
  },
  C: {
    title: '酸っぱい臭い（胃腸系）',
    comment: '酸っぱい口臭は、胃腸の不調で起こることがあります。嘔吐や下痢が重なると急ぎ度が上がるので、様子をよく見てあげてください。',
    tips: ['直近で吐いた／下痢がある／食後に気持ち悪そう、などがあればメモしておくと相談がスムーズです。', '急に悪化する時もあるので、回数が増える・元気が落ちる場合は早めに切り替えてください。'],
    articles: [{ url: 'https://kinswith-vet.com/journal/3415/', title: '急性胃腸炎の症例' }, { url: 'https://kinswith-vet.com/journal/774/', title: '下痢の原因と対処' }, { url: 'https://kinswith-vet.com/journal/868/', title: '口臭まとめ' }]
  },
  D: {
    title: '便臭（消化器系）',
    comment: '便のようなにおいは、消化器の不調が重なっているサインとして扱うのが安全です。嘔吐や下痢、便通の変化が一緒にある時は早めに相談できると安心です。',
    tips: ['便臭っぽい時は、嘔吐・下痢・便通の有無をセットで見るのが大事です。', '"便が出ない＋嘔吐"の組み合わせは負担が大きくなりやすいので、無理に様子見しなくて大丈夫です。'],
    articles: [{ url: 'https://kinswith-vet.com/journal/3759/', title: 'PLE＋胃内異物の症例' }, { url: 'https://kinswith-vet.com/journal/3415/', title: '急性胃腸炎の症例' }, { url: 'https://kinswith-vet.com/journal/868/', title: '口臭まとめ' }]
  }
};

// 歯科治療LP
const DENTAL_LP_PAGES = [
  { id: 1, type: 'hero', topLine: '年間400件以上の歯科手術を実施', title: 'なるべく歯を抜かない歯周治療', subtitle: '当院では、歯周病や歯石、口内炎などの口腔内トラブルの治療・予防から、歯周外科・歯周組織の再生療法に至るまで幅広い歯科ケアを行っています。\n\n歯を守ることは患者さんの食事と生活、ひいては健康寿命を守ることに繋がると考えています。治療したその日だけでなく、以降の暮らしにまでお力添えできれば幸いです。', tags: ['歯周病', '歯が折れた', '歯石取り', '口内炎', 'その他の歯周外科', '歯磨きケア・予防'], image: 'https://kinswith-vet-com.s3.us-west-1.amazonaws.com/wp-content/uploads/2025/09/21084440/fv%40pc.webp' },
  { id: 2, type: 'why', title: '歯を残せるのには理由があります', columns: [{ label: 'WHY.01', title: '高難度な手術を行う体制と実績', desc: '再生療法、抜髄・根管治療など' }, { label: 'WHY.02', title: '正確な治療を実現する設備', desc: '高精度顕微鏡(マイクロスコープ)・歯科専用レントゲン' }, { label: 'WHY.03', title: '歯科に特化した獣医師の在籍', desc: 'ヒトの歯科医師の学会参加、歯科に特化した研鑽' }], conclusion: '充実した設備と卓越した技術で、\n多様な治療を行ってまいりました。' },
  { id: 3, type: 'cases', title: '[歯周病] Before / After', cases: [
    { desc: '10才の小型犬の重度歯周炎と破折', url: 'https://kinswith-vet.com/journal/3003/', urlLabel: 'この症例の記事を読む', image: 'https://kinswith-vet-com.s3.us-west-1.amazonaws.com/wp-content/uploads/2026/02/13015126/No.8_%E3%82%A2%E3%82%A4%E3%82%AD%E3%83%A3%E3%83%83%E3%83%81-1290x855-2.webp' },
    { desc: '7才中型犬の歯周治療', url: 'https://kinswith-vet.com/journal/2810/', urlLabel: 'この症例の記事を読む', image: 'https://kinswith-vet-com.s3.us-west-1.amazonaws.com/wp-content/uploads/2026/02/13015125/No.8_%E3%82%A2%E3%82%A4%E3%82%AD%E3%83%A3%E3%83%83%E3%83%81-1290x855-1.webp' },
  ] },
  { id: 4, type: 'cases', title: '[破折(歯が折れた)] Before / After', cases: [
    { desc: '歯の破折に対し抜歯を行わずに治療', url: 'https://kinswith-vet.com/journal/1703/', urlLabel: 'この症例の記事を読む', image: 'https://kinswith-vet-com.s3.us-west-1.amazonaws.com/wp-content/uploads/2026/02/13015124/image-1521-2.webp' },
    { desc: '5才小型犬の犬歯抜髄根管治療', url: 'https://kinswith-vet.com/journal/2769/', urlLabel: 'この症例の記事を読む', image: 'https://kinswith-vet-com.s3.us-west-1.amazonaws.com/wp-content/uploads/2026/02/13015127/shorei_batsuzui_0522-1.webp' },
  ] },
  { id: 5, type: 'equipment', title: '歯を残す治療を\n実現するための設備', subtitle: '導入しているのは日本で数院\n歯科用マイクロスコープを用いた治療', points: ['見落としを減らし、精度が上がる', '必要な処置を絞れて、負担を減らしやすい', '施術の確実性が上がり、治療の質が安定'], image: 'https://kinswith-vet-com.s3.us-west-1.amazonaws.com/wp-content/uploads/2025/09/30104658/Frame-7662-2.png' },
  { id: 6, type: 'equipment', title: '歯を残す治療を\n実現するための設備', subtitle: '「歯を残せるか判断するため」に必要な\n高精度歯科専用レントゲン', points: ['歯科レントゲンは歯1本単位で評価できる', '「残すべき歯」「抜くべき歯」を見極める材料になる', '抜歯は不可逆だからこそ、判断の精度が大事'], image: 'https://kinswith-vet-com.s3.us-west-1.amazonaws.com/wp-content/uploads/2025/09/30104704/Frame-7666-1.png' },
  { id: 7, type: 'doctor', title: '歯科を担当する獣医師', doctors: [
    { name: '清川 理香', role: '獣医師', affiliation: '日本獣医歯科学会 所属', stance: 'ご家族に寄り添った丁寧な診療を心がけておりますので、ご不安なことがあればいつでもご相談ください。', image: 'https://kinswith-vet-com.s3.us-west-1.amazonaws.com/wp-content/uploads/2024/09/09213539/kiyokawa-s-1.webp' },
    { name: '岡田 純一', role: '院長', affiliation: '日本獣医歯科学会 所属', stance: '愛犬さん、愛猫さんとご家族が元気いっぱいで幸せな時間を長く過ごすお手伝いができるよう、努めて参ります。', image: 'https://kinswith-vet-com.s3.us-west-1.amazonaws.com/wp-content/uploads/2023/09/15070923/okada_junichi.webp' }
  ] },
  { id: 8, type: 'voices', title: '飼い主さんの声', voices: [{ text: '抜歯手術をお願いしました。治療法なども丁寧に説明していただき、何パターンか提案もいただき、納得する方法で施術をしていただけました。歯医者さんなので歯のことは安心してお任せできると感じました。これからも定期検査に伺います。ありがとうございました。', tag: '抜歯手術' }, { text: '8歳で初めて麻酔しての歯石除去を行いました。先生から熱心な説明をしていただき、毎日丁寧な歯磨きを心がけています。歯周ポケットの歯石までしっかりケアが大切な事を知りました。リラックスしながら楽しく歯磨き出来るようなりたいです。', tag: '歯石除去' }], conclusionLink: { text: '他の口コミを確認する(Google Map)', url: 'https://www.google.co.jp/maps/place/KINS+WITH+%E5%8B%95%E7%89%A9%E7%97%85%E9%99%A2+%E4%BA%8C%E5%AD%90%E7%8E%89%E5%B7%9D%E6%9C%AC%E9%99%A2/@35.6152666,139.622914,788m/data=!3m2!1e3!5s0x6018f4140f84f0db:0x6cefab564c8a8cfc!4m8!3m7!1s0x6018f541cb22308d:0x1aac41607ba33af0!8m2!3d35.6152666!4d139.6254889!9m1!1b1!16s%2Fg%2F11t6y8j9hl?hl=ja&entry=ttu&g_ep=EgoyMDI1MDkyMi4wIKXMDSoASAFQAw%3D%3D' } }
];

// 治療の流れLP
const FLOW_LP_PAGES = [
  { id: 1, step: '予約', title: 'WEBまたは電話でご予約', body: '当院は予約優先制となっております。\nネットまたはお電話にてご予約の上、ご来院ください。', image: 'https://kinswith-vet-com.s3.us-west-1.amazonaws.com/wp-content/uploads/2026/02/13050934/Frame-7726.webp', flowType: 'main' },
  { id: 2, step: '初診', title: '問診とお口の確認', body: '問診票の回答がございますので、予約時間の10分前にご来院をいただくとスムーズです。\n\n丁寧にお話をお伺いし、視診による病気のご説明や初期の治療方針をご案内いたします。', image: 'https://kinswith-vet-com.s3.us-west-1.amazonaws.com/wp-content/uploads/2026/02/13050933/Frame-7725.webp', flowType: 'main' },
  { id: 3, step: '検査', title: '必要に応じて検査で状態を把握', body: '健康状態を把握するため、血液検査やエコー、レントゲン、心電図等を実施いたします。病理検査を行う場合は、院内の検査よりもお時間をいただく場合がございます。', image: 'https://kinswith-vet-com.s3.us-west-1.amazonaws.com/wp-content/uploads/2026/02/13050935/Frame-7727.webp', flowType: 'main' },
  { id: 4, step: '再診', title: '結果をもとに治療方針をご案内', body: '検査結果をもとに、具体的な治療方針をご案内いたします。飼い主の方にご同意をいただき次第、治療を開始いたします。\n\n※ 「歯を残す／抜歯が必要」などの判断も、ここで整理してお伝えします。', image: 'https://kinswith-vet-com.s3.us-west-1.amazonaws.com/wp-content/uploads/2026/02/13050938/Frame-7729.webp', flowType: 'main' },
  { id: 5, step: '手術', title: '麻酔の安全性を確認し、手術を実施', body: '手術を必要とする病状の場合は、麻酔に対応が可能かを検査結果をもとに慎重に判断いたします。基本的に当日退院となりますが、状況により入院になる場合がございます。', image: 'https://kinswith-vet-com.s3.us-west-1.amazonaws.com/wp-content/uploads/2026/02/13050939/Frame-7731.webp', flowType: 'surgery' },
  { id: 6, step: '検診', title: '術後の経過をチェック', body: '約1週間を目安に術後の検診を行います。\n治り具合や痛みの様子、食事の状況などを確認します。', image: 'https://kinswith-vet-com.s3.us-west-1.amazonaws.com/wp-content/uploads/2026/02/13050937/Frame-7728.webp', flowType: 'surgery' },
];

// --- 歯磨きガイドLP ---
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
    title: '犬の歯磨きのやり方',
    subtitle: '犬・猫の歯医者さん監修',
    body: '3歳以上の犬のおよそ8割が歯周病を抱えていると言われています。\n歯磨きは歯周病予防のいちばんの味方。\nこのガイドでは、正しい手順を一歩ずつ進められます。',
    image: BRUSHING_IMG.fv,
  },
  {
    id: 2, type: 'prep',
    title: 'はじめに準備するもの',
    prepItems: [
      { name: '歯磨きジェル', points: ['愛犬が好む味を選ぶ'] },
      { name: '歯ブラシ', points: ['柔らかいものを選ぶ', 'ガーゼやシートもOK'] },
    ],
    body: '苦手な子の多い歯磨きの時間を、\n「楽しいもの」と思ってもらうことが大切。',
    products: [
      { name: 'DENTAL GEL for dogs', desc: '歯磨きが好きになる美味しいジェル', url: 'https://kinswith-vet.com/product/1754/', image: 'https://kinswith-vet-com.s3.us-west-1.amazonaws.com/wp-content/uploads/2023/11/13021818/DENTAL-GEL-for-dogs.webp' },
      { name: '泡雪プラチナナノ歯ブラシ', desc: 'とろけるような柔らかさで刺激を抑えた', url: 'https://kinswith-vet.com/product/1750/', image: 'https://kinswith-vet-com.s3.us-west-1.amazonaws.com/wp-content/uploads/2024/02/17231210/wawyknash.webp' },
    ],
  },
  {
    id: 3, type: 'challenge', step: 'STEP 02', challengeIndex: 0,
    title: 'お口を触られることに慣れよう',
    body: 'ご褒美のジェルをお手元に用意して、触らせてくれたらすぐにあげましょう。まずは数秒から。',
    tips: ['押さえつけない', '嫌がったら無理しない', 'まだ歯ブラシは使わない', '徐々に触る時間を伸ばす'],
    image: BRUSHING_IMG.step02,
    rewards: {
      pet: [
        'お口のまわり、触らせてくれたね。えらい！',
        'ちょっとびっくりしたかもだけど、がんばったね',
        '最初の一歩をクリア。すごいよ！',
        'ドキドキしたよね。でも乗り越えた！',
        '{name}、よくがんばった！それだけで花マルだよ',
        '触らせてくれてありがとう。{name}は勇気あるね',
        'こわかったかもしれないけど、信じてくれたんだね',
        'ちょっとずつでいいからね。今日の{name}、100点だよ',
        '{name}なりのペースで大丈夫。ちゃんと進んでるよ',
        'はじめてのことって誰だって緊張するよね。おつかれさま',
        'この調子この調子〜！',
        'お口タッチ、クリア！ …意外とイケたでしょ？',
        '{name}選手、第一関門を突破しました！',
        'お口周りを触れるだけで、日々の健康チェックがぐっと楽になりますよ',
        'まずは触れることが大事。歯磨きの土台はここから始まります',
      ],
      owner: [
        '焦らず向き合えたこと、それだけで大きな一歩です',
        '触らせてくれるまで待てたあなたもすごいです',
        'うまくいかなくても、やろうとしたことが偉いんです',
        '「やってみよう」と思えたこと自体が、もう前進です',
        'ここから始まるケアの第一歩。おめでとうございます',
        '今日の一歩が、{name}の歯の健康につながっていきます',
        '{name}のために行動できるあなた、すてきです',
        'うまくできなくても気にしないでください。練習あるのみです',
        '無理せず、でもちゃんと向き合えている。それがいちばん大事です',
        'あなたが穏やかでいてくれたから、{name}もがんばれたんです',
        'え、もうクリア？ 才能ありますよ、これ',
        '第一関門クリア。この調子でどんどんいきましょう',
        '口周りを触る練習は、毎日少しずつがコツです。5秒からでOK',
        'ジェルをご褒美に使うと、「触られる＝いいこと」と覚えてくれますよ',
      ],
    },
  },
  {
    id: 4, type: 'challenge', step: 'STEP 03', challengeIndex: 1,
    title: '唇をめくってみよう',
    body: '「唇をめくる → ご褒美をあげる」を繰り返します。嫌がったら STEP 02 に戻って大丈夫。',
    tips: ['やさしくゆっくり', '嫌がったら前のSTEPに戻る', 'ご褒美はすぐあげる'],
    image: BRUSHING_IMG.step03,
    rewards: {
      pet: [
        'ちゃんと見せてくれてありがとう！',
        'お口、見せてくれたね。信頼の証だよ',
        'めくられても怒らなかった！えらすぎ',
        'きみのがんばり、ちゃんと見てるよ',
        '{name}、唇めくりクリア！かっこいいよ',
        'この勇気、拍手！',
        'ちょっとイヤだったかもしれないけど、ありがとうね',
        '{name}が安心してくれてる証拠だよ。うれしいな',
        '焦らなくていいからね。{name}のペースでいこう',
        '信じて見せてくれたその気持ち、大事にするからね',
        'おっ、いい歯してるじゃん！',
        '歯のチラ見せ、いただきました',
        '{name}のお口、ちゃんとチェックできた！合格！',
        '唇をめくれるようになると、歯茎の色で健康状態がわかるようになりますよ',
        'ピンク色の歯茎は健康のサイン。赤みが強いときは要チェックです',
      ],
      owner: [
        '嫌がっても諦めなかったあなたもすごいです',
        'お互いの信頼関係が深まっています',
        'この一歩が未来の歯の健康につながります',
        'うまくできなくても、練習した時間にちゃんと意味があります',
        'ちゃんと見てあげられるって、それだけですごいことです',
        '{name}があなたを信頼している証拠ですね',
        '「戻ってもいい」と思える余裕、大事です',
        'あなたの優しい手つきが、{name}の安心につながっています',
        '少しずつでいいんです。確実に前に進んでいますよ',
        'いつも{name}のことを考えてくれて、ありがとうございます',
        '唇めくりマスターへの道、着々と進んでますね',
        'これができたら、もう立派な歯磨きトレーナーです',
        '次のステップも、きっとクリアできますよ',
        '唇をめくって歯茎をチェックする習慣をつけると、異変に早く気づけます',
        '歯茎が腫れていたり出血がある場合は、一度獣医さんに相談してみてください',
      ],
    },
  },
  {
    id: 5, type: 'challenge', step: 'STEP 04', challengeIndex: 2,
    title: '歯・歯ぐきを触ってみよう',
    body: '指で歯や歯ぐきにタッチ → ご褒美。最初は前歯から、慣れたら少しずつ奥へ。',
    tips: ['切歯と犬歯から', '奥歯は無理しない', 'タッチしたらすぐご褒美'],
    image: BRUSHING_IMG.step04,
    rewards: {
      pet: [
        '歯を触っても怒らなかったね。すごい！',
        'お口の中まで触らせてくれるなんて…信頼されてるなぁ',
        '歯ぐきタッチ、クリア！きみは勇者だよ',
        'ここまでできたら、もう歯磨き上級者の入口！',
        'えらいねぇ…！ほんとにえらい',
        '{name}、ぜんぶ受け止めてくれてありがとう',
        'こわくなかったかな？ {name}、がんばったね',
        'ちょっとずつ慣れていこうね。きみのペースでいいから',
        'お口の中って敏感だから、触らせてくれるだけですごいことなんだよ',
        '今日も{name}はがんばり屋さんだね',
        '歯ぐきタッチ成功！ …え、余裕だった？',
        'プロの域に近づいてるよ、すごい！',
        '{name}の歯、ちゃんと綺麗にしていこうね！',
        '歯と歯肉の境目をやさしく触れるようになると、歯垢ケアの効果がぐんと上がります',
        '奥歯は歯垢がたまりやすいポイント。少しずつ奥まで触れるようになるといいですよ',
      ],
      owner: [
        'ここまでできたら、もう立派な歯磨きトレーニングです',
        'お口の中を触れるようになるのは大きな進歩です',
        '愛犬のペースに合わせられるあなた、すてきです',
        '実はここまでが一番むずかしい。よく乗り越えました',
        '{name}もあなたも、本当によくがんばりましたね',
        '着実にステップアップしています。自信を持ってください',
        '焦らず進めてこられたこと、{name}は感じ取っていますよ',
        'うまくいかない日があっても大丈夫。積み重ねが大事です',
        'あなたの「ていねいにやろう」という気持ちが、いちばんの薬です',
        '{name}と二人三脚でここまで来られたこと、すばらしいです',
        'もはやベテラン飼い主の風格、出てますよ',
        'ここクリアできる人、実はそんなに多くないんです。すごいですよ',
        '歯ぐきタッチ、完了。次もいっちゃいましょう',
        '歯垢ケアの土台ができました。ここからブラシを使えると効果倍増です',
        '歯肉に赤みや腫れがないか、触りながらチェックする習慣をつけると安心です',
      ],
    },
  },
  {
    id: 'vet1', type: 'vetCheck',
    title: '獣医師CHECK',
    body: 'とても大事なことは、愛犬にとって歯磨きの時間が「嬉しい時間」「楽しい時間」と最初に認識してもらう事です。\n\n次からは実践編のご説明となります。\n\n一つ一つのステップに3日〜1週間かけてご準備を頂いても問題ございません。\n\n焦らずに準備編が出来てから実践へお進みください。',
    image: 'https://kinswith-vet-com.s3.us-west-1.amazonaws.com/wp-content/uploads/2024/09/09213539/kiyokawa-s-1.webp',
  },
  {
    id: 6, type: 'challenge', step: 'STEP 05', challengeIndex: 3,
    title: '前歯を磨いてみよう',
    body: '上顎を持ち上げるように唇を引き上げて、歯ブラシを45度に傾けて磨きます。',
    tips: ['歯ブラシは45度に傾ける', '歯茎に沿ってやさしく', '最初は数本でOK'],
    image: BRUSHING_IMG.step05,
    rewards: {
      pet: [
        '歯ブラシ、受け入れてくれたんだね！',
        'ブラシで磨かせてくれるなんて…きみ、天才では？',
        'しゃこしゃこ…がんばったね！',
        '歯磨き、できちゃったね！すごいことだよ',
        '{name}、ほんとにえらい。ぜんぶがんばったね',
        'ブラシの感触、だんだん慣れてくるからね。おつかれさま',
        '最初はびっくりするよね。でもちゃんとがんばった',
        'きみが安心できるように、ゆっくりやっていこうね',
        '歯磨きできる{name}、かっこいいよ',
        '今日もがんばった{name}に、いっぱいのありがとう',
        'もう余裕かな？ 実はみんなできないんだよ〜！',
        '{name}選手、ブラッシングステージ突破！おめでとうございます',
        'いいぞ〜！ キラキラな歯を目指していこう！',
        '前歯が磨けたら、少しずつ奥歯にも挑戦してみてね。奥歯は歯垢がたまりやすいよ',
        '最初は数本でOK。ブラシを口に入れること自体が大きな成果です',
      ],
      owner: [
        '愛犬と一緒にここまで来れたこと、誇っていいです',
        'ブラシを使えるようになったのは大きなマイルストーンです',
        '最初は数本で十分。完璧を目指さなくていいんです',
        'ここまでできるなんて、愛犬もあなたを信頼してる証拠です',
        '{name}のために続けてきた努力が、形になっていますね',
        'あなたと{name}の歯磨きタイム、すばらしいです',
        '毎回うまくいかなくてもいいんです。やろうとしたことが大事',
        '{name}の健康を守りたいというその気持ちが、いちばんの原動力です',
        'あなたが笑顔でいることが、{name}にとってもいちばんの安心です',
        '一緒にがんばってくれる飼い主さんがいて、{name}は幸せですね',
        '歯磨き仲間として、もう上級者ですよ',
        '今日から「うちの子、歯磨きできるんです」って言えますね',
        '歯垢除去率がぐっと上がりますよ。すばらしい！',
        '歯ブラシは45度の角度で歯と歯肉の境目に当てるのがポイントです',
        'ゴシゴシこすらず、やさしく小刻みに動かすと効果的ですよ',
      ],
    },
  },
  {
    id: 7, type: 'challenge', step: 'STEP 06', challengeIndex: 4,
    title: 'デンタルケアウォーターを作ろう',
    body: 'ジェルを1〜2cm出して、普段の飲み水に溶かします。手軽にケア成分をお口全体に届けられます。',
    tips: ['ジェル1〜2cmが目安', 'いつもの飲み水に溶かすだけ', '歯磨き後の仕上げにぴったり'],
    image: BRUSHING_IMG.step06,
    rewards: {
      pet: [
        'おいしく飲めたかな？',
        'ごくごく…ケア完了！おつかれさま',
        'デンタルウォーター、がんばって飲んでくれたね',
        '{name}、最後までやりきった！すごい！',
        '仕上げまで完璧。きみはえらい！',
        '水を飲むだけでケアできちゃう。{name}、ラクしてるね〜',
        'ぜんぶのステップ、おつかれさまだよ',
        '最後まで付き合ってくれてありがとう。{name}、だいすき',
        '{name}のがんばりが、健康な毎日につながるんだよ',
        '今日もいい子だったね。ゆっくり休んでね',
        'お水飲んでるだけなのに、ケアになっちゃう。得だね〜',
        '{name}選手、全ステージクリア目前！',
        '飲むだけでいいなんて…最高のステップだよね',
        'デンタルケアウォーターは毎日のお水に混ぜるだけで口腔ケアができます',
        '水を飲む量が少ない子は、ごはんにかけてあげるのもアリですよ',
      ],
      owner: [
        '仕上げまでていねいにできました。すばらしいです',
        '全ステップ、おつかれさまでした',
        'ここまでの全ステップ、おつかれさまでした',
        '{name}の健康を守る習慣が、もう始まっています',
        '愛犬のケアをここまでできるあなた、ほんとうにすごいです',
        '最後まで諦めずに取り組んでくれて、ありがとうございます',
        '{name}と過ごすこの時間も、大切なコミュニケーションです',
        '完璧じゃなくていいんです。続けることがいちばんの力になります',
        'あなたがケアしてくれるから、{name}の歯は守られています',
        '今日やったこと、ぜんぶ{name}のためになっていますよ',
        'この仕上げだけでも毎日やる価値がありますよ',
        '簡単だけど効果的。毎日のケアに取り入れやすいですよ',
        '飲むだけケア、最強のお手軽ステップですよね',
        'デンタルケアウォーターは歯磨きと併用するとさらに効果的です',
        '毎日のお水で口腔内の細菌バランスを整えることができます',
      ],
    },
  },
  {
    id: 8, type: 'info',
    title: '苦手な子へのアドバイス',
    body: '歯磨きをする時は、愛犬が落ち着いている時間帯と環境を選んであげましょう。\n\nどうしても難しい場合は、STEP 06 のデンタルウォーターから始めるのもおすすめです。',
    doctorNote: '歯石がついてしまった場合は動物病院での施術が必要です。歯茎の赤みや口臭が気になるときは、一度ご相談ください。',
    image: BRUSHING_IMG.why1,
  },
  {
    id: 9, type: 'product',
    title: 'おすすめアイテム',
    subtitle: 'まだお気に入りが見つかっていなければ、こちらもどうぞ。',
    products: [
      { name: 'DENTAL GEL for dogs', desc: '歯磨きが好きになる美味しいジェル', url: 'https://kinswith-vet.com/product/1754/', image: '' },
      { name: '泡雪プラチナナノ歯ブラシ', desc: 'とろけるような柔らかさで刺激を抑えた', url: 'https://kinswith-vet.com/product/1750/', image: '' },
    ],
  },
  {
    id: 10, type: 'complete',
    title: 'おつかれさま！',
    messages: [
      '{name}と飼い主さん、おつかれさま！\n「今日やれた」ことが何よりすごい。\n完璧じゃなくて大丈夫。\nまたここに来てくれたらいつでも一緒に始められます。',
      '{name}、全ステップクリア！\nあなたと{name}の歯磨きチーム、最高です。\nこの調子で、楽しくケアを続けていきましょう。',
      'すごい！ぜんぶやりきった！\n{name}もあなたも、今日はたくさんがんばりました。\nこのがんばりが、{name}の健康な毎日をつくります。',
      '{name}のお口ケア、大成功！\n最初は不安だったかもしれません。\nでも、ここまで来られたのはあなたの愛情の証です。',
      'おつかれさまでした！\n歯磨きは「続けること」がいちばん大事。\n完璧じゃなくていいから、また一緒にやりましょう。',
      'クリアおめでとうございます！\n{name}との歯磨きタイムが、\nこれからの日課になりますように。',
      '{name}と一緒にやりきったこの時間、\nふたりの大切な思い出です。\nまたいつでもチャレンジしに来てください。',
      '全ステップ完了！\n今日の{name}、とってもがんばりました。\nそして、それを支えたあなたもすごい。\nおつかれさまでした！',
    ],
  },
];

const BRUSHING_EXIT_MESSAGES = [
  'ここまでで十分。またやりたくなったら来てね',
  '今日はおしまい！{name}もあなたもおつかれさま',
  '無理しないのも、大事なケアのひとつです',
  '続きはいつでも。{name}のペースで大丈夫',
  '今日がんばった分、ちゃんと{name}に届いてるよ',
  '{name}も飼い主さんもおつかれさま。今日はゆっくり休んでね',
  'やめどきを知ってるのも、いい飼い主の証拠です',
  '嫌がるときは無理しない。それが正解です',
  '今日ここまでできたこと、忘れないでくださいね',
  'また{name}とチャレンジしに来てね。待ってます',
];

const BRUSHING_TOTAL = 5;
const brushingRandomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const brushingReplaceName = (text, name) => text.replace(/\{name\}/g, name || 'あなたの愛犬');

function BrushingStepImage({ src, alt }) {
  return (
    <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', marginBottom: '14px', backgroundColor: '#F5EDE4' }}>
      <img src={src} alt={alt || ''} style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }}
        onError={(e) => {
          e.target.parentElement.style.display = 'flex';
          e.target.parentElement.style.alignItems = 'center';
          e.target.parentElement.style.justifyContent = 'center';
          e.target.parentElement.style.height = '80px';
          e.target.outerHTML = '<span style="font-size:12px;color:#A69B8D">画像を読み込み中…</span>';
        }}
      />
    </div>
  );
}
const API_URL = "https://wept-api.onrender.com";

// 現在のページがjournal記事かどうか判定
function getJournalKey() {
  const path = window.location.pathname;
  const match = path.match(/\/(journal\/\d+)/);
  return match ? match[1] : null;
}

// WEPT_ARTICLES から記事データを取得（PHP側でwp_localize_scriptで注入済み）
function getArticleByKey(key) {
  if (typeof WEPT_ARTICLES !== 'undefined' && WEPT_ARTICLES[key]) {
    return WEPT_ARTICLES[key];
  }
  return null;
}

// GA4 トラッキング
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
  
  // 写真チェック用
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [imageConverting, setImageConverting] = useState(false);
  const fileInputRef = useRef(null);
  
  // 口臭チェック用
  const [breathStep, setBreathStep] = useState(0);
  const [breathAnswers, setBreathAnswers] = useState({});
  const [breathResult, setBreathResult] = useState(null);
  
  // LP用
  const [dentalLpPage, setDentalLpPage] = useState(0);
  const [flowLpPage, setFlowLpPage] = useState(0);

  // 歯磨きガイドLP用
  const [brushingPage, setBrushingPage] = useState(0);
  const [petName, setPetName] = useState(() => {
    try { return localStorage.getItem('wept_pet_name') || ''; } catch(e) { return ''; }
  });
  const [clearedSteps, setClearedSteps] = useState(new Set());
  const [showReward, setShowReward] = useState(null);
  const [showBrushingExit, setShowBrushingExit] = useState(false);
  const [brushingExitMsg, setBrushingExitMsg] = useState('');
  const [confetti, setConfetti] = useState([]);
  
  const messagesEndRef = useRef(null);
  const openedAtRef = useRef(null);
  const isSuggestionRef = useRef(false);

  // 背面スクロールロック
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // チャットドットアニメーション用CSS注入
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

  // 歯磨きガイド紙吹雪
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
        trackEvent('wept_brushing_complete', { pet_name: petName || '' });
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
        text: data.reply || "すみません、回答を取得できませんでした。",
        articles: data.articles || []
      }]);
    } catch (error) {
      console.error("Chat API Error:", error);
      setMessages((prev) => [...prev, {
        type: "bot",
        text: "すみません、通信エラーが発生しました。しばらくしてからもう一度お試しください。",
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
      trackEvent('wept_brushing_start', { pet_name: petName || '' });
    } else if (feature === 'article-summary') {
      setCurrentView('article-summary');
      const jk = getJournalKey();
      if (jk) { const a = getArticleByKey(jk); trackEvent('wept_article_view', { article_key: jk, article_title: a?.title || '' }); }
    }
  };

  // HEIC判定ヘルパー
  const isHeicFile = (file) => {
    if (file.type && (file.type === 'image/heic' || file.type === 'image/heif')) return true;
    const name = (file.name || '').toLowerCase();
    return name.endsWith('.heic') || name.endsWith('.heif');
  };

  // 画像圧縮（HEIC→JPG変換 + Canvas圧縮）
  const compressImage = async (file, maxWidth = 1024, quality = 0.7) => {
    let processedFile = file;

    // HEIC変換
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

    // Canvas圧縮
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

  // 写真チェック - 画像選択
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
        prediction: '診断できませんでした',
        confidence: '-',
        reason: '通信エラーが発生しました。もう一度お試しください。',
        advice: '写真を撮り直して再度チェックしてみてください。'
      });
      setCurrentView('photo-result');
    } finally {
      setIsLoading(false);
    }
  };

  // 口臭チェック
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

  // スタイル定義
  const s = {
    btn: { backgroundColor: '#FFF9F5', border: '1px solid #E8DDD3', borderRadius: '12px', padding: '12px 8px', cursor: 'pointer', textAlign: 'center', width: '100%' },
    btnPrimary: { backgroundColor: '#8B6B5C', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px', cursor: 'pointer', width: '100%', fontSize: '14px', fontWeight: 'bold' },
    btnSecondary: { backgroundColor: '#F5EDE4', color: '#5D5D5D', border: 'none', borderRadius: '12px', padding: '12px', cursor: 'pointer', width: '100%', fontSize: '14px' },
    btnClear: { background: 'linear-gradient(135deg, #8B6B5C 0%, #965D57 100%)', color: '#fff', border: 'none', borderRadius: '14px', padding: '14px', cursor: 'pointer', width: '100%', fontSize: '15px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(139,107,92,0.3)' },
    btnExit: { background: 'none', border: 'none', color: '#A69B8D', fontSize: '12px', cursor: 'pointer', padding: '8px', marginTop: '8px' },
    input: { flex: 1, borderRadius: '9999px', border: '1px solid #e8ddd3', padding: '10px 12px', backgroundColor: '#f5ede4', color: '#3d3d3d', fontSize: '14px', outline: 'none' },
    send: { width: '44px', height: '44px', borderRadius: '9999px', border: 0, backgroundColor: '#8B6B5C', color: '#fff', cursor: 'pointer', fontSize: '16px', flexShrink: 0 },
  };

  // 共通ヘッダー
  const Header = ({ title }) => (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <div>
          {currentView !== 'menu' && (
            <button onClick={backToMenu} style={{ fontSize: '12px', color: '#A69B8D', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>← 戻る</button>
          )}
        </div>
        <button onClick={close} style={{ fontSize: '18px', color: '#A69B8D', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>✕</button>
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
          相談する
        </button>
      )}

      {/* オーバーレイ */}
      <div className={`wept-overlay ${isOpen ? 'is-open' : ''}`} onClick={close} />

      {/* ドロワー */}
      <aside className={`wept-drawer ${isOpen ? 'is-open' : ''}`}>
        <div className="wept-body">
          
          {/* ===== menu ===== */}
          {currentView === "menu" && (
            <>
              <Header title="どうされましたか？" />
              {/* journal ページの場合のみ「記事を要約する」ボタンを表示 */}
              {getJournalKey() && (
                <button onClick={() => handleFeatureClick('article-summary')} style={{ ...s.btnPrimary, marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <span>📄</span><span>この記事を要約する</span>
                </button>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                <button onClick={() => handleFeatureClick('photo')} style={s.btn}><div style={{ fontSize: '12px', fontWeight: 500, color: '#5D5D5D', lineHeight: 1.4 }}>写真で<br/>歯周病チェック</div></button>
                <button onClick={() => handleFeatureClick('breath')} style={s.btn}><div style={{ fontSize: '12px', fontWeight: 500, color: '#5D5D5D', lineHeight: 1.4 }}>口臭の原因<br/>セルフチェック</div></button>
                <button onClick={() => handleFeatureClick('dental-lp')} style={s.btn}><div style={{ fontSize: '12px', fontWeight: 500, color: '#5D5D5D', lineHeight: 1.4 }}>当院の歯科治療<br/>強みと特徴</div></button>
                <button onClick={() => handleFeatureClick('flow-lp')} style={s.btn}><div style={{ fontSize: '12px', fontWeight: 500, color: '#5D5D5D', lineHeight: 1.4 }}>歯科治療の流れ<br/>初診から手術まで</div></button>
                <button onClick={() => handleFeatureClick('brushing-lp')} style={{ ...s.btn, gridColumn: '1 / -1' }}><div style={{ fontSize: '12px', fontWeight: 500, color: '#5D5D5D', lineHeight: 1.4 }}>犬の歯磨き<br/>実践ガイド</div></button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E8E0D5' }} />
                <span style={{ fontSize: '12px', color: '#A69B8D' }}>または</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E8E0D5' }} />
              </div>
              <p style={{ fontSize: '13px', marginBottom: '10px', color: '#5D5D5D' }}>気になる症状やお悩みを入力してください</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {["歯石が気になる", "口臭がする", "歯茎が赤い", "歯石を取りたい", "歯が折れた", "歯がグラグラする", "ごはんを食べにくそう", "口を痛がる"].map((text, idx) => (
                  <button key={idx} onClick={() => { isSuggestionRef.current = true; setInputValue(text); }} style={{ fontSize: '11px', padding: '6px 10px', borderRadius: '9999px', backgroundColor: '#F5EDE4', color: '#5D5D5D', border: 'none', cursor: 'pointer' }}>{text}</button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.nativeEvent.isComposing && handleSend()} placeholder="症状やお悩みを入力..." style={s.input} />
                <button onClick={handleSend} disabled={!inputValue.trim()} style={{ ...s.send, opacity: !inputValue.trim() ? 0.5 : 1 }}>↑</button>
              </div>
            </>
          )}

          {/* ===== photo-check ===== */}
          {currentView === "photo-check" && (
            <>
              <Header title="写真で歯周病チェック" />
              <div style={{ backgroundColor: '#FDF8F3', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
                <p style={{ fontSize: '13px', color: '#5D5D5D', margin: 0, lineHeight: 1.6 }}>愛犬・愛猫の歯の写真を撮影して、AIが歯周病の可能性をチェックします。</p>
              </div>
              
              <input type="file" accept="image/*,.heic,.heif" ref={fileInputRef} onChange={handleImageSelect} style={{ display: 'none' }} />
              
              {imageConverting ? (
                <div style={{ textAlign: 'center', padding: '32px 20px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', color: '#5D5D5D', marginBottom: '8px' }}>画像を変換しています...</div>
                  <div style={{ height: '6px', backgroundColor: '#E8E0D5', borderRadius: '3px', overflow: 'hidden' }}>
                    <div className="wept-loading-bar" style={{ height: '100%', backgroundColor: '#8B6B5C', borderRadius: '3px' }} />
                  </div>
                </div>
              ) : !imagePreview ? (
                <button onClick={() => fileInputRef.current?.click()} style={{ ...s.btn, padding: '32px 20px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📷</div>
                  <div style={{ fontSize: '13px', color: '#5D5D5D' }}>写真を選択</div>
                </button>
              ) : (
                <div style={{ marginBottom: '16px' }}>
                  <img src={imagePreview} alt="選択した画像" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { setSelectedImage(null); setImagePreview(null); }} style={{ ...s.btnSecondary, flex: 1 }} disabled={isLoading}>撮り直す</button>
                    <button onClick={analyzePhoto} disabled={isLoading} style={{ ...s.btnPrimary, flex: 1, opacity: isLoading ? 0.7 : 1 }}>
                      {isLoading ? '分析中...' : 'チェックする'}
                    </button>
                  </div>
                  
                  {/* ローディングGIFアニメ */}
                  {isLoading && (
                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                      {typeof WEPT_CONFIG !== 'undefined' && WEPT_CONFIG.assetsUrl ? (
                        <img
                          src={`${WEPT_CONFIG.assetsUrl}/loading-animation.gif`}
                          alt="分析中..."
                          style={{ width: '320px', maxWidth: '100%', height: 'auto' }}
                        />
                      ) : (
                        <div style={{ height: '8px', backgroundColor: '#E8E0D5', borderRadius: '4px', overflow: 'hidden' }}>
                          <div className="wept-loading-bar" style={{ height: '100%', backgroundColor: '#8B6B5C', borderRadius: '4px' }} />
                        </div>
                      )}
                      <div style={{ fontSize: '12px', color: '#5D5D5D', marginTop: '8px' }}>
                        AIが画像を分析しています...
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div style={{ backgroundColor: '#F5EDE4', borderRadius: '8px', padding: '12px' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '6px' }}>撮影のコツ</p>
                <ul style={{ fontSize: '11px', color: '#5D5D5D', margin: 0, paddingLeft: '16px', lineHeight: 1.6 }}>
                  <li>明るい場所で撮影</li>
                  <li>歯と歯茎がはっきり見えるように</li>
                  <li>ブレないように固定して撮影</li>
                </ul>
              </div>
              
              <p style={{ fontSize: '11px', color: '#A69B8D', marginTop: '12px' }}>※この結果は目安です。正確な診断は獣医師にご相談ください。</p>
            </>
          )}

          {/* ===== photo-result ===== */}
          {currentView === "photo-result" && diagnosisResult && (
            <>
              <Header title="チェック結果" />
              
              {imagePreview && (
                <img src={imagePreview} alt="診断した画像" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px' }} />
              )}
              
              <div style={{ backgroundColor: '#FDF8F3', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '8px' }}>{diagnosisResult.prediction}</div>
                <div style={{ display: 'inline-block', fontSize: '11px', backgroundColor: '#E8E0D5', color: '#5D4E4E', padding: '4px 8px', borderRadius: '4px', marginBottom: '12px' }}>信頼度: {diagnosisResult.confidence}</div>
                <p style={{ fontSize: '13px', color: '#5D5D5D', marginBottom: '12px', lineHeight: 1.6 }}>{diagnosisResult.reason}</p>
                <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '12px', border: '1px solid #E8E0D5' }}>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#8B6B5C', marginBottom: '4px' }}>アドバイス</p>
                  <p style={{ fontSize: '13px', color: '#5D5D5D', margin: 0, lineHeight: 1.6 }}>{diagnosisResult.advice}</p>
                </div>
              </div>
              
              <button onClick={backToMenu} style={s.btnPrimary}>TOPに戻る</button>
            </>
          )}

          {/* ===== breath-check ===== */}
          {currentView === "breath-check" && (
            <>
              <Header title="口臭の原因セルフチェック" />
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#A69B8D', marginBottom: '6px' }}>
                  <span>質問 {breathStep + 1} / {BREATH_QUESTIONS.length}</span>
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
                <button onClick={() => setBreathStep(breathStep - 1)} style={{ ...s.btnSecondary, marginTop: '16px' }}>← 前の質問に戻る</button>
              )}
            </>
          )}

          {/* ===== breath-result ===== */}
          {currentView === "breath-result" && breathResult && (
            <>
              <Header title="チェック結果" />
              
              <div style={{ backgroundColor: '#FDF8F3', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '12px' }}>{breathResult.title}</div>
                <p style={{ fontSize: '13px', color: '#5D5D5D', marginBottom: '16px', lineHeight: 1.6 }}>{breathResult.comment}</p>
                
                <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#8B6B5C', marginBottom: '8px' }}>確認しておきたいこと</p>
                  {breathResult.tips.map((tip, idx) => (
                    <p key={idx} style={{ fontSize: '12px', color: '#5D5D5D', marginBottom: '6px', lineHeight: 1.5 }}>・{tip}</p>
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '8px' }}>関連する記事</p>
                {breathResult.articles.map((article, idx) => (
                  <a key={idx} href={article.url} target="_blank" rel="noreferrer" style={{ display: 'block', backgroundColor: '#fff', border: '1px solid #E8DDD3', borderRadius: '8px', padding: '10px 12px', marginBottom: '6px', textDecoration: 'none' }}>
                    <span style={{ fontSize: '13px', color: '#5D5D5D' }}>{article.title}</span>
                  </a>
                ))}
              </div>
              
              <button onClick={backToMenu} style={s.btnPrimary}>TOPに戻る</button>
            </>
          )}

          {/* ===== dental-lp ===== */}
          {currentView === "dental-lp" && (() => {
            const dlpPage = DENTAL_LP_PAGES[dentalLpPage];
            return (
            <>
              <Header title="当院の歯科治療" />
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
                    {dlpPage.image ? (
                      <div style={{ width: '100%', height: '180px', borderRadius: '12px', marginBottom: '14px', overflow: 'hidden' }}>
                        <img src={dlpPage.image} alt={dlpPage.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div style={{ width: '100%', height: '120px', borderRadius: '12px', marginBottom: '14px', overflow: 'hidden', backgroundColor: '#F5EDE4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '12px', color: '#A69B8D' }}>🦷 歯科治療の様子</span>
                      </div>
                    )}
                    <p style={{ fontSize: '12px', color: '#8B7B6B', marginBottom: '14px', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{dlpPage.subtitle}</p>
                    <div style={{ backgroundColor: '#FDF8F3', borderRadius: '12px', padding: '12px', border: '1px solid #E8DDD3' }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#8B6B5C', marginBottom: '8px' }}>対応できる治療</div>
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
                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#5D4E4E', whiteSpace: 'pre-line' }}>{col.title}</div>
                        <div style={{ fontSize: '11px', color: '#8B7B6B' }}>{col.desc}</div>
                      </div>
                    ))}
                    <p style={{ fontSize: '13px', color: '#5D4E4E', textAlign: 'center', marginTop: '8px', whiteSpace: 'pre-line' }}>{dlpPage.conclusion}</p>
                  </>
                )}

                {/* cases (Before/After) */}
                {dlpPage.type === 'cases' && (
                  <>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '12px' }}>{dlpPage.title}</div>
                    {dlpPage.cases.map((c, i) => (
                      <div key={i} style={{ backgroundColor: '#fff', border: '1px solid #E8E0D5', borderRadius: '8px', padding: '10px', marginBottom: '8px' }}>
                        {c.image ? (
                          <div style={{ width: '100%', borderRadius: '6px', overflow: 'hidden', marginBottom: '8px' }}>
                            <img src={c.image} alt={c.desc} style={{ width: '100%', display: 'block' }} />
                          </div>
                        ) : (
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
                        )}
                        <p style={{ fontSize: '12px', color: '#5D5D5D', margin: '0 0 6px 0', lineHeight: 1.5 }}>{c.desc}</p>
                        <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#8B6B5C', fontWeight: 500, textDecoration: 'none' }}>
                          {c.urlLabel} →
                        </a>
                      </div>
                    ))}
                  </>
                )}

                {/* equipment */}
                {dlpPage.type === 'equipment' && (
                  <>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '8px', whiteSpace: 'pre-line' }}>{dlpPage.title}</div>
                    <p style={{ fontSize: '12px', color: '#8B7B6B', marginBottom: '12px', whiteSpace: 'pre-line' }}>{dlpPage.subtitle}</p>
                    {dlpPage.image && (
                      <div style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                        <img src={dlpPage.image} alt={dlpPage.title} style={{ width: '100%', display: 'block' }} />
                      </div>
                    )}
                    {dlpPage.points.map((p, i) => <div key={i} style={{ fontSize: '13px', color: '#5D5D5D', marginBottom: '6px' }}>{i+1}. {p}</div>)}
                    {dlpPage.note && <p style={{ fontSize: '11px', color: '#A69B8D', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #E8E0D5' }}>{dlpPage.note}</p>}
                  </>
                )}

                {/* doctor */}
                {dlpPage.type === 'doctor' && (
                  <>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '12px' }}>{dlpPage.title}</div>
                    {dlpPage.doctors && dlpPage.doctors.map((doctor, idx) => (
                      <div key={idx} style={{ backgroundColor: '#FDF8F3', borderRadius: '12px', padding: '14px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                          {doctor.image ? (
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                              <img src={doctor.image} alt={doctor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          ) : (
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#E8E0D5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#8B7B6B', flexShrink: 0 }}>Dr</div>
                          )}
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#5D4E4E' }}>{doctor.name}</div>
                            <div style={{ fontSize: '11px', color: '#8B7B6B' }}>{doctor.role}</div>
                            <div style={{ fontSize: '10px', color: '#A69B8D' }}>{doctor.affiliation}</div>
                          </div>
                        </div>
                        <p style={{ fontSize: '12px', color: '#5D5D5D', margin: 0, lineHeight: 1.6 }}>{doctor.stance}</p>
                      </div>
                    ))}
                  </>
                )}

                {/* voices */}
                {dlpPage.type === 'voices' && (
                  <>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '12px' }}>{dlpPage.title}</div>
                    {dlpPage.voices.map((v, i) => (
                      <div key={i} style={{ backgroundColor: '#fff', border: '1px solid #E8E0D5', borderRadius: '8px', padding: '10px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '10px', backgroundColor: '#F5EDE4', color: '#8B6B5C', padding: '2px 8px', borderRadius: '9999px' }}>{v.tag}</span>
                        <p style={{ fontSize: '12px', color: '#5D5D5D', margin: '8px 0 0 0', lineHeight: 1.6 }}>{v.text}</p>
                      </div>
                    ))}
                    {dlpPage.conclusionLink ? (
                      <div style={{ textAlign: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E8E0D5' }}>
                        <a href={dlpPage.conclusionLink.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#8B6B5C', fontWeight: 500, textDecoration: 'none' }}>
                          {dlpPage.conclusionLink.text} →
                        </a>
                      </div>
                    ) : dlpPage.conclusion ? (
                      <p style={{ fontSize: '13px', color: '#5D4E4E', textAlign: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E8E0D5' }}>{dlpPage.conclusion}</p>
                    ) : null}
                  </>
                )}

              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                {dentalLpPage > 0 && <button onClick={() => setDentalLpPage(dentalLpPage - 1)} style={{ ...s.btnSecondary, flex: 1 }}>← 前へ</button>}
                {dentalLpPage < DENTAL_LP_PAGES.length - 1 ? (
                  <button onClick={() => setDentalLpPage(dentalLpPage + 1)} style={{ ...s.btnPrimary, flex: 1 }}>次へ →</button>
                ) : (
                  <button onClick={backToMenu} style={{ ...s.btnPrimary, flex: 1 }}>TOPに戻る</button>
                )}
              </div>
            </>
            );
          })()}

          {/* ===== flow-lp ===== */}
          {currentView === "flow-lp" && (
            <>
              <Header title="歯科治療の流れ" />
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '8px', flexWrap: 'wrap' }}>
                {(FLOW_LP_PAGES[flowLpPage].flowType === 'main' ? ['予約', '初診', '検査', '再診'] : ['手術', '検診']).map((step, idx) => {
                  const isActive = FLOW_LP_PAGES[flowLpPage].flowType === 'main' ? flowLpPage === idx : (flowLpPage === 4 && idx === 0) || (flowLpPage === 5 && idx === 1);
                  return (
                    <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '9999px', backgroundColor: isActive ? '#8B6B5C' : '#F5EDE4', color: isActive ? '#fff' : '#8B7B6B' }}>{step}</span>
                      {idx < (FLOW_LP_PAGES[flowLpPage].flowType === 'main' ? 3 : 1) && <span style={{ margin: '0 2px', color: '#D4C9BC' }}>→</span>}
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
                {FLOW_LP_PAGES[flowLpPage].image && (
                  <div style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                    <img src={FLOW_LP_PAGES[flowLpPage].image} alt={FLOW_LP_PAGES[flowLpPage].title} style={{ width: '100%', display: 'block' }} />
                  </div>
                )}
                <div style={{ backgroundColor: '#FDF8F3', borderRadius: '12px', padding: '14px', marginBottom: '12px' }}>
                  <p style={{ fontSize: '13px', color: '#5D5D5D', whiteSpace: 'pre-line', margin: 0, lineHeight: 1.6 }}>{FLOW_LP_PAGES[flowLpPage].body}</p>
                </div>
                {FLOW_LP_PAGES[flowLpPage].note && <p style={{ fontSize: '11px', color: '#A69B8D' }}>※ {FLOW_LP_PAGES[flowLpPage].note}</p>}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                {flowLpPage > 0 && <button onClick={() => setFlowLpPage(flowLpPage - 1)} style={{ ...s.btnSecondary, flex: 1 }}>← 前へ</button>}
                {flowLpPage < FLOW_LP_PAGES.length - 1 ? (
                  <button onClick={() => setFlowLpPage(flowLpPage + 1)} style={{ ...s.btnPrimary, flex: 1 }}>次へ →</button>
                ) : (
                  <button onClick={backToMenu} style={{ ...s.btnPrimary, flex: 1 }}>TOPに戻る</button>
                )}
              </div>
            </>
          )}

          {/* ===== brushing-lp ===== */}
          {currentView === "brushing-lp" && (() => {
            const bp = BRUSHING_LP_PAGES[brushingPage];
            const displayName = petName || 'あなたの愛犬';

            const handleClear = (ci) => {
              setShowReward({ pet: brushingReplaceName(brushingRandomPick(bp.rewards.pet), petName), owner: brushingReplaceName(brushingRandomPick(bp.rewards.owner), petName) });
              setClearedSteps(prev => new Set([...prev, ci]));
              trackEvent('wept_brushing_step_clear', { step_id: bp.step, step_number: bp.challengeIndex + 1 });
            };
            const handleBrushingExit = () => {
              setBrushingExitMsg(brushingReplaceName(brushingRandomPick(BRUSHING_EXIT_MESSAGES), petName));
              setShowBrushingExit(true);
              trackEvent('wept_brushing_exit', { step_number: bp.challengeIndex + 1, total_cleared: clearedSteps.size });
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
                    <span style={{ fontSize: '10px', color: '#A69B8D' }}>準備中</span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '3px' }}>{p.name}</div>
                  <div style={{ fontSize: '11px', color: '#8B7B6B', marginBottom: '4px' }}>{p.desc}</div>
                  <div style={{ fontSize: '11px', color: '#8B6B5C', fontWeight: 500 }}>詳しく見る →</div>
                </div>
              </a>
            );

            return (
            <>
              <Header title="歯磨きガイド" />

              {/* プログレスバー */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#A69B8D', marginBottom: '4px' }}>
                  <span>達成度</span>
                  <span>{clearedSteps.size} / {BRUSHING_TOTAL}</span>
                </div>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {Array.from({ length: BRUSHING_TOTAL }, (_, i) => (
                    <div key={i} style={{ flex: 1, height: '6px', borderRadius: '3px', backgroundColor: clearedSteps.has(i) ? '#8B6B5C' : '#E8E0D5', transition: 'background-color 0.3s' }} />
                  ))}
                </div>
              </div>

              {/* ドットインジケーター */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '12px' }}>
                {BRUSHING_LP_PAGES.map((_, idx) => (
                  <button key={idx} onClick={() => setBrushingPage(idx)} style={{ width: '7px', height: '7px', borderRadius: '50%', border: 'none', backgroundColor: brushingPage === idx ? '#8B6B5C' : '#D4C9BC', cursor: 'pointer', padding: 0 }} />
                ))}
              </div>

              <div style={{ minHeight: '240px' }}>

                {/* ===== intro ===== */}
                {bp.type === 'intro' && (
                  <div style={{ animation: 'fadeInUp 0.4s ease' }}>
                    <BrushingStepImage src={bp.image} alt="歯磨きガイド" />
                    <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '6px' }}>{bp.title}</div>
                      <div style={{ fontSize: '14px', color: '#8B7B6B' }}>{bp.subtitle}</div>
                    </div>
                    <div style={{ backgroundColor: '#FDF8F3', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
                      <p style={{ fontSize: '13px', color: '#5D5D5D', whiteSpace: 'pre-line', margin: 0, lineHeight: 1.7 }}>{bp.body}</p>
                    </div>
                    <div style={{ backgroundColor: '#fff', border: '1px solid #E8DDD3', borderRadius: '12px', padding: '14px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#8B6B5C', display: 'block', marginBottom: '8px' }}>愛犬の名前（任意）</label>
                      <input type="text" value={petName} onChange={(e) => {
                        const v = e.target.value;
                        setPetName(v);
                        try { if (v) localStorage.setItem('wept_pet_name', v); else localStorage.removeItem('wept_pet_name'); } catch(e) {}
                      }} placeholder="例：ポチ、ジョン"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E8DDD3', backgroundColor: '#FDF8F3', fontSize: '14px', color: '#5D4E4E', outline: 'none', boxSizing: 'border-box' }}
                      />
                      <p style={{ fontSize: '11px', color: '#A69B8D', margin: '6px 0 0' }}>入力すると、ちょっと嬉しいことがあります</p>
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
                            <div key={j} style={{ fontSize: '11px', color: '#5D5D5D', marginBottom: '3px', lineHeight: 1.5 }}>・{pt}</div>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div style={{ backgroundColor: '#FDF8F3', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
                      <p style={{ fontSize: '13px', color: '#5D5D5D', whiteSpace: 'pre-line', margin: 0, lineHeight: 1.7 }}>{bp.body}</p>
                    </div>
                    {bp.products && (
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#8B6B5C', marginBottom: '8px' }}>KINSのお気に入り</p>
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
                        {bp.image ? (
                          <img src={bp.image} alt={bp.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '10px', color: '#A69B8D' }}>PHOTO</span>
                        )}
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
                      <div style={{ marginBottom: '14px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#8B6B5C', marginBottom: '6px' }}>ポイント</p>
                        {bp.tips.map((tip, i) => (
                          <div key={i} style={{ fontSize: '12px', color: '#5D5D5D', marginBottom: '4px', paddingLeft: '8px' }}>・{tip}</div>
                        ))}
                      </div>
                    )}
                    {clearedSteps.has(bp.challengeIndex) ? (
                      <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#FDF8F3', borderRadius: '12px', border: '1px solid #E8DDD3' }}>
                        <span style={{ fontSize: '13px', color: '#8B6B5C', fontWeight: 'bold' }}>クリア済み！</span>
                      </div>
                    ) : (
                      <>
                        <button onClick={() => handleClear(bp.challengeIndex)} style={s.btnClear}>できた！</button>
                        <div style={{ textAlign: 'center' }}>
                          <button onClick={handleBrushingExit} style={s.btnExit}>今日はここまでにする</button>
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
                      <div style={{ marginBottom: '14px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#8B6B5C', marginBottom: '6px' }}>ポイント</p>
                        {bp.tips.map((tip, i) => (
                          <div key={i} style={{ fontSize: '12px', color: '#5D5D5D', marginBottom: '4px', paddingLeft: '8px' }}>・{tip}</div>
                        ))}
                      </div>
                    )}
                    {bp.doctorNote && (
                      <div style={{ backgroundColor: '#fff', border: '1px solid #E8DDD3', borderRadius: '10px', padding: '12px' }}>
                        <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#965D57', marginBottom: '4px' }}>獣医師より</p>
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
                        <span style={{ fontWeight: 'bold', fontSize: '20px' }}>{displayName}</span> の
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '14px' }}>歯磨きチャレンジ クリア！</div>
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
                        <div style={{ fontSize: '10px', color: '#A69B8D' }}>犬・猫の歯医者さん</div>
                      </div>
                    </div>
                    <p style={{ fontSize: '12px', color: '#A69B8D' }}>スクショして記念に残そう！</p>
                  </div>
                )}

              </div>

              {/* ナビゲーション */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                {brushingPage > 0 && (
                  <button onClick={() => setBrushingPage(brushingPage - 1)} style={{ ...s.btnSecondary, flex: 1 }}>← 前へ</button>
                )}
                {brushingPage < BRUSHING_LP_PAGES.length - 1 ? (
                  <button onClick={() => setBrushingPage(brushingPage + 1)} style={{ ...s.btnPrimary, flex: 1 }}>次へ →</button>
                ) : (
                  <button onClick={backToMenu} style={{ ...s.btnPrimary, flex: 1 }}>TOPに戻る</button>
                )}
              </div>

              {/* 報酬モーダル */}
              {showReward && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
                  <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '320px', animation: 'scaleIn 0.3s ease', textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '16px' }}>やったね！</div>
                    <div style={{ backgroundColor: '#FDF8F3', borderRadius: '12px', padding: '14px', marginBottom: '10px', textAlign: 'left' }}>
                      <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#8B6B5C', marginBottom: '4px' }}>{displayName}へ</p>
                      <p style={{ fontSize: '13px', color: '#5D5D5D', margin: 0, lineHeight: 1.6 }}>{showReward.pet}</p>
                    </div>
                    <div style={{ backgroundColor: '#F5EDE4', borderRadius: '12px', padding: '14px', marginBottom: '16px', textAlign: 'left' }}>
                      <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#965D57', marginBottom: '4px' }}>飼い主さんへ</p>
                      <p style={{ fontSize: '13px', color: '#5D5D5D', margin: 0, lineHeight: 1.6 }}>{showReward.owner}</p>
                    </div>
                    <button onClick={closeReward} style={s.btnPrimary}>次のステップへ →</button>
                  </div>
                </div>
              )}

              {/* 途中離脱モーダル */}
              {showBrushingExit && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
                  <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '320px', animation: 'scaleIn 0.3s ease', textAlign: 'center' }}>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#5D4E4E', marginBottom: '12px' }}>おつかれさま</div>
                    <p style={{ fontSize: '13px', color: '#5D5D5D', lineHeight: 1.7, marginBottom: '16px' }}>{brushingExitMsg}</p>
                    <button onClick={() => { setShowBrushingExit(false); backToMenu(); }} style={s.btnPrimary}>メニューに戻る</button>
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
                  <Header title="記事のまとめ" />
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <p style={{ fontSize: '14px', color: '#5D5D5D', marginBottom: '16px' }}>この記事の要約データが見つかりませんでした。</p>
                    <button onClick={backToMenu} style={s.btnPrimary}>TOPに戻る</button>
                  </div>
                </>
              );
            }

            // summary を文字列に整形
            let summaryText = '';
            if (typeof article.summary === 'object' && article.summary !== null) {
              summaryText = Object.entries(article.summary)
                .filter(([_, v]) => v)
                .map(([k, v]) => `【${k}】\n${v}`)
                .join('\n\n');
            } else if (typeof article.summary === 'string') {
              summaryText = article.summary;
            }

            const labels = article.labels || [];

            return (
              <>
                <Header title="記事のまとめ" />
                {/* 記事タイトル */}
                <div style={{ backgroundColor: '#FDF8F3', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#5D4E4E', margin: 0, lineHeight: 1.5 }}>📄 {article.title}</p>
                </div>

                {/* 要約テキスト */}
                {summaryText && (
                  <div style={{ backgroundColor: '#fff', border: '1px solid #E8E0D5', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
                    <p style={{ fontSize: '13px', color: '#5D5D5D', whiteSpace: 'pre-line', margin: 0, lineHeight: 1.7 }}>{summaryText}</p>
                  </div>
                )}

                {/* ラベル（アンカーリンク） */}
                {labels.length > 0 && (
                  <div style={{ marginBottom: '14px' }}>
                    <p style={{ fontSize: '12px', color: '#8B7B6B', marginBottom: '8px', fontWeight: 'bold' }}>気になるポイント</p>
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

                {/* 記事リンク */}
                <a href={article.url} target="_top" style={{ display: 'block', textDecoration: 'none', marginBottom: '10px' }} onClick={() => trackEvent('wept_article_fullread', { article_key: journalKey, article_title: article.title })}>
                  <div style={{ ...s.btnPrimary, textAlign: 'center' }}>記事の全文を読む →</div>
                </a>

                <button onClick={backToMenu} style={s.btnSecondary}>TOPに戻る</button>
              </>
            );
          })()}

          {/* ===== chat ===== */}
          {currentView === "chat" && (
            <>
              <Header title="相談中" />
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
                        <p style={{ fontSize: '11px', color: '#8B7B6B', margin: 0 }}>おすすめの記事</p>
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

        {/* chat時のフッター */}
        {currentView === "chat" && (
          <div className="wept-footer">
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.nativeEvent.isComposing && handleSend()} placeholder="続けて質問..." className="wept-input" />
            <button onClick={handleSend} disabled={!inputValue.trim()} style={{ ...s.send, opacity: !inputValue.trim() ? 0.5 : 1 }}>↑</button>
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