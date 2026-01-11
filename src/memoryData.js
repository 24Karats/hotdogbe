// memoryData.js - 回憶資料配置
// 你可以在這裡編輯你的回憶內容

export const memories = [
    {
        id: 1,
        type: 'photo',
        title: '哈逗寶',
        x: 600,
        data: {
            date: '2024/01/15',
            location: '咖啡廳',
            text: '還記得那天我們聊了好久，時間過得好快...',
            // 之後可以加入真實照片路徑
            // photo: '/path/to/photo.jpg'
        }
    },
    {
        id: 2,
        type: 'text',
        title: '哈逗寶',
        x: 1100,
        data: {
            date: '2024/02/14',
            text: '那天我鼓起勇氣對你說：「我喜歡你，可以當我的女朋友嗎？」\n\n你笑著說：「好啊！」\n\n那一刻，我覺得自己是世界上最幸福的人。'
        }
    },
    {
        id: 3,
        type: 'photo',
        title: '哈逗寶',
        x: 1600,
        data: {
            date: '2024/05/20',
            location: '海邊',
            text: '我們一起看日落，一起吹海風，一起許下未來的願望...',
            // photo: '/path/to/travel.jpg'
        }
    },
    {
        id: 4,
        type: 'text',
        title: '哈逗寶',
        x: 2200,
        data: {
            date: '2025/01/15',
            text: '親愛的，\n\n這一年來，謝謝你陪伴我度過每一個日子。\n\n有你在身邊，每一天都是最美好的回憶。\n\n我愛你，未來的每一天，我們一起走下去！\n\n❤️'
        }
    }
];
