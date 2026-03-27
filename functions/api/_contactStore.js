const THREAD_INDEX_KEY = 'contact:threads:index';

function getStore(env) {
  const store = env.CONTACT_THREADS;

  if (!store) {
    throw new Error('contact_store_not_configured');
  }

  return store;
}

function threadKey(threadId) {
  return `contact:thread:${threadId}`;
}

function telegramMessageKey(messageId) {
  return `contact:telegram:${messageId}`;
}

async function getThreadIndex(store) {
  return (await store.get(THREAD_INDEX_KEY, 'json')) || [];
}

async function putThreadIndex(store, index) {
  await store.put(THREAD_INDEX_KEY, JSON.stringify(index));
}

export async function listContactThreads(env) {
  const store = getStore(env);
  const index = await getThreadIndex(store);
  const threads = await Promise.all(index.map((threadId) => store.get(threadKey(threadId), 'json')));

  return threads.filter(Boolean);
}

export async function createContactThread(env, thread) {
  const store = getStore(env);
  const index = await getThreadIndex(store);

  await store.put(threadKey(thread.id), JSON.stringify(thread));
  await putThreadIndex(store, [thread.id, ...index.filter((threadId) => threadId !== thread.id)]);
}

export async function updateContactThread(env, thread) {
  const store = getStore(env);
  await store.put(threadKey(thread.id), JSON.stringify(thread));
}

export async function mapTelegramMessageToThread(env, messageId, threadId) {
  const store = getStore(env);
  await store.put(telegramMessageKey(messageId), threadId);
}

export async function getThreadByTelegramMessageId(env, messageId) {
  const store = getStore(env);
  const threadId = await store.get(telegramMessageKey(messageId));

  if (!threadId) {
    return null;
  }

  return store.get(threadKey(threadId), 'json');
}

export async function appendTelegramReply(env, messageId, reply) {
  const thread = await getThreadByTelegramMessageId(env, messageId);

  if (!thread) {
    return null;
  }

  const nextThread = {
    ...thread,
    replies: [...(thread.replies || []), reply],
    updatedAt: new Date().toISOString(),
  };

  await updateContactThread(env, nextThread);

  return nextThread;
}
