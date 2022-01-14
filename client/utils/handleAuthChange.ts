async function handleAuthChange(event: string, session: any) {
  await fetch("/api/auth", {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "same-origin",
    body: JSON.stringify({ event, session }),
  });
}

export default handleAuthChange;
