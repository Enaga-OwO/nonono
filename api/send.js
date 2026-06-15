const webpush = require('web-push');

// ⚠️ 生成したVAPID鍵（公開鍵と秘密鍵）をここに設定します
const publicVapidKey = 'BLeo7qrQMW9lIOF_nHoIjEAwV3yqYf3i54veOXjArFjCgqY1HUK43UKKiJPcroQMUoiMjk7g4zhbMi4S97Qbuj8';
const privateVapidKey = 'kXr_xBW8MxpyJ8zuvOzAxTJCh2_etxPfI6CenUZUjIc';

// web-pushの初期化設定（連絡先メールアドレスと鍵をセット）
webpush.setVapidDetails(
    'mailto:your-email@example.com',
    publicVapidKey,
    privateVapidKey
);

// Vercel Serverless Function のメイン処理
export default async function handler(req, res) {
    // POSTリクエスト以外は拒否
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    // PHPから届いたデータを分解
    const { subscription, title, body } = req.body;

    if (!subscription) {
        return res.status(400).json({ error: 'Missing subscription data' });
    }

    try {
        // 暗号化したメッセージをブラウザのプッシュサーバーへ送信
        await webpush.sendNotification(
            subscription,
            JSON.stringify({ title, body })
        );

        // 成功をPHP側に返す
        return res.status(200).json({ success: true, message: 'Notification sent successfully' });
    } catch (error) {
        console.error('Push Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
