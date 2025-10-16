// app/page.tsx
export default async function Home() {
  // SSR時に外部APIへPOST
  const res = await fetch("http://localhost:3001/myitem", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: 42 }),
    next: { revalidate: 0 }, // キャッシュ無効化（重要）
  });

  const hogeRes = await fetch("http://localhost:3001/hoge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 0 }, // キャッシュ無効化（重要）
  });

  const data = await res.json();
  const hogeData = await hogeRes.json();

  return (
    <main className="flex flex-col gap-4 p-14 App">
      <h1>Try Integration SSR</h1>
      <p data-testid="api-result">{JSON.stringify(data)}</p>

      <div>hogeコール結果: {hogeData.message}</div>
    </main>
  );
}
