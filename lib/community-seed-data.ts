
// Realistic Korean community data for seeding

export const COMMON_POSTS = [
    { title: '오늘 장 흐름 어떻게 보시나요?', content: '시장이 너무 불안정하네요. 현금 비중 늘려야 할까요? 고수님들의 의견 궁금합니다.', category: 'ANALYSIS' },
    { title: '배당금 입금 언제 되나요?', content: '저번 분기 배당금 아직 안 들어온 것 같은데 다들 받으셨나요?', category: 'QNA' },
    { title: '이 종목 지금 진입해도 될까요?', content: '차트상으로는 바닥 찍은 것 같은데 더 떨어질까봐 무섭네요.', category: 'ANALYSIS' },
    { title: '단타 치다가 물렸습니다 ㅠㅠ', content: '욕심 부리다가 고점에서 잡았네요... 구조대 오겠죠?', category: 'HUMOR' },
    { title: '경기 침체 우려가 크네요', content: '금리 인하 시점이 늦어지면서 투심이 위축되는 것 같습니다.', category: 'NEWS' },
    { title: '성투하세요 다들!', content: '오늘도 파이팅입니다. 빨간불 기원합니다!', category: 'FREE' },
    { title: '주린이 포트폴리오 조언 부탁드립니다', content: '이제 막 시작했는데 기술주 위주로 담았습니다. 너무 위험할까요?', category: 'QNA' },
    { title: '역시 우량주가 답이네요', content: '잡주 타다가 골로 갈 뻔했습니다. 대장주만 믿고 갑니다.', category: 'Unspecified' },
]

export const STOCK_SPECIFIC_POSTS: Record<string, { title: string, content: string, category: string }[]> = {
    // Samsung Electronics
    '005930': [
        { title: '8만전자 언제 다시 가나요?', content: '7만전자에서 너무 오래 횡보하네요. 답답합니다.', category: 'ANALYSIS' },
        { title: '외인들 수급 들어오네요', content: '오늘 프로그램 매수세가 강한 것 같습니다. 반등 시그널일까요?', category: 'ANALYSIS' },
        { title: '삼전은 적금처럼 모으는거죠', content: '떨어질 때마다 줍줍하고 있습니다. 언젠간 빛을 보겠죠.', category: 'FREE' },
    ],
    // SK Hynix
    '000660': [
        { title: '하이닉스 실적 대박이네요', content: 'HBM 수요가 받쳐주니 영업이익이 기대 이상입니다.', category: 'NEWS' },
        { title: '전고점 뚫을 기세입니다', content: '엔비디아랑 같이 간다! 가즈아!', category: 'HUMOR' },
    ],
    // EcoPro BM
    '247540': [
        { title: '2차전지 다시 붐 올까요?', content: '전기차 수요 둔화라는데 걱정입니다. 장투해도 될지...', category: 'QNA' },
        { title: '공매도 세력 너무하네', content: '주가 누르기가 너무 심합니다. 숏스퀴즈 안 나오나요?', category: 'ANALYSIS' },
    ],
    // Apple
    'AAPL': [
        { title: '애플카 포기 아쉽네요', content: '그래도 AI에 집중한다는 전략은 맞는 것 같습니다.', category: 'NEWS' },
        { title: '아이폰 판매량 괜찮나요?', content: '중국 시장 규제가 타격이 클지 걱정입니다.', category: 'ANALYSIS' },
        { title: '애플은 걱정하는 거 아니라던데', content: '워렌 버핏도 가지고 있는데 그냥 들고 갑니다.', category: 'FREE' },
    ],
    // Tesla
    'TSLA': [
        { title: '일론 머스크 또 트윗했네요', content: '도지코인 얘기 그만하고 테슬라 신경 좀 썼으면...', category: 'HUMOR' },
        { title: '모델2 언제 나오나요?', content: '저가형 모델이 나와야 점유율 반등할 텐데 기다리기 힘드네요.', category: 'QNA' },
        { title: 'FSD 버전 12 써보신 분?', content: '유튜브 영상 보니 진짜 자율주행 가까워진 것 같습니다.', category: 'NEWS' },
    ],
    // Nvidia
    'NVDA': [
        { title: '천비디아 가즈아!', content: 'AI 랠리는 이제 시작입니다. 거품 아니에요.', category: 'HUMOR' },
        { title: '액면분할 가능성 있을까요?', content: '가격이 너무 비싸서 개미들이 접근하기 힘드네요.', category: 'QNA' },
    ]
}

export const COMMENTS = [
    '동감합니다.',
    '좋은 분석이네요.',
    '성투하세요!',
    '저도 물려있습니다 ㅠㅠ',
    '추매 타이밍인 것 같습니다.',
    '손절이 답인가요...',
    '정보 감사합니다.',
    '믿고 갑니다!',
    'ㅋㅋㅋ',
    '구조대 곧 도착합니다 기다리세요',
    '배당이나 받으면서 버텨야죠.',
    '지금 들어가도 되나요?',
    '저는 관망 중입니다.',
]
