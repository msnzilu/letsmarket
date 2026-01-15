// lib/social-publishers/x.ts
export async function publishToX(accessToken: string, content: string) {
    const response = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: content }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || data.message || 'X publishing failed');
    }

    return {
        id: data.data.id,
        url: `https://twitter.com/user/status/${data.data.id}`,
    };
}
