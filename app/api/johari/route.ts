import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

// In-memory store (would use a database in production)
const sessions: Record<string, {
  userId: string;
  userTags: string[];
  friendTags: string[] | null;
  createdAt: number;
}> = {};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, tags } = body;

    if (type === 'create') {
      // Create new session
      const id = nanoid(10);
      const userId = nanoid(8);
      sessions[id] = {
        userId,
        userTags: tags || [],
        friendTags: null,
        createdAt: Date.now(),
      };
      return NextResponse.json({ id, userId });
    }

    if (type === 'submit-friend') {
      // Friend submits their tags
      const { sessionId, tags: friendTags } = body;
      const session = sessions[sessionId];
      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }
      session.friendTags = friendTags || [];
      return NextResponse.json({ success: true });
    }

    if (type === 'update-user') {
      // Update user's tags
      const { sessionId, tags: userTags } = body;
      const session = sessions[sessionId];
      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }
      session.userTags = userTags || [];
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const session = sessions[id];
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  // Don't expose userId in the response for friend view
  return NextResponse.json({
    id,
    userTags: session.userTags,
    friendTags: session.friendTags,
    hasFriendResponse: session.friendTags !== null,
  });
}
