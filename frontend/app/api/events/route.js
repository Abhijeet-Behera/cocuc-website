import { NextResponse } from 'next/server';
import { getAllEvents, createEventItem, deleteEventItem } from '../../../lib/eventsStore';
import { fetchGoogleDriveImages, countWords } from '../../../lib/googleDrive';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const wingId = searchParams.get('wingId') || undefined;
    const search = searchParams.get('search') || undefined;

    const events = getAllEvents(wingId, search);

    return NextResponse.json({
      success: true,
      data: events,
      count: events.length,
    });
  } catch (error) {
    console.error('[API events GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve events', data: [] },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, wingId, wingName, description, folderUrl, eventDate, location, authorName } = body;

    // Validation
    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: 'Event title is required.' },
        { status: 400 }
      );
    }

    if (!wingId || !wingId.trim()) {
      return NextResponse.json(
        { success: false, error: 'Target wing selection is required.' },
        { status: 400 }
      );
    }

    if (!description || !description.trim()) {
      return NextResponse.json(
        { success: false, error: 'Event description is required.' },
        { status: 400 }
      );
    }

    // Live word count validation (up to 1000 words max)
    const words = countWords(description);
    if (words > 1000) {
      return NextResponse.json(
        {
          success: false,
          error: `Description exceeds the 1000-word limit. Current count is ${words} words. Please trim ${words - 1000} words.`,
          currentWords: words,
          maxWords: 1000,
        },
        { status: 400 }
      );
    }

    if (!folderUrl || !folderUrl.trim()) {
      return NextResponse.json(
        { success: false, error: 'Google Drive folder link is required.' },
        { status: 400 }
      );
    }

    // Fetch images from Google Drive API
    let images = body.images || [];
    let folderId = body.folderId;

    if (!images || images.length === 0) {
      const driveResult = await fetchGoogleDriveImages(folderUrl, undefined, wingId);
      images = driveResult.images || [];
      folderId = driveResult.folderId;
    }

    const createdEvent = createEventItem({
      title,
      wingId,
      wingName,
      description,
      folderUrl,
      folderId,
      images,
      coverImage: images[0] || body.coverImage,
      eventDate,
      location,
      authorName: authorName || 'Admin',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Event uploaded and associated with wing successfully!',
        data: createdEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API events POST] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Event ID parameter is required for deletion.' },
        { status: 400 }
      );
    }

    const deleted = deleteEventItem(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Event not found or already deleted.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Event removed successfully.',
    });
  } catch (error) {
    console.error('[API events DELETE] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete event' },
      { status: 500 }
    );
  }
}
