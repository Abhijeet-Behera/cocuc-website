import { NextResponse } from 'next/server';
import { getAllEvents, createEventItem, deleteEventItem } from '../../../lib/eventsStore';
import { fetchGoogleDriveImages, countWords } from '../../../lib/googleDrive';
import { getFolderIdForDomain } from '../../../lib/googleDriveService';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain') || searchParams.get('wingId') || undefined;
    const search = searchParams.get('search') || undefined;

    const events = getAllEvents(domain, search);

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
    const {
      title,
      date,
      eventDate,
      domain,
      wingId,
      wingName,
      description,
      imageUrls,
      images,
      folderUrl,
      location,
      authorName,
    } = body;

    // Validation
    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: 'Event title is required.' },
        { status: 400 }
      );
    }

    const effectiveDomain = domain || wingId;
    if (!effectiveDomain || !effectiveDomain.trim()) {
      return NextResponse.json(
        { success: false, error: 'Domain / Wing selection is required.' },
        { status: 400 }
      );
    }

    const safeDescription = description && description.trim() ? description.trim() : '';
    if (!safeDescription) {
      return NextResponse.json(
        { success: false, error: 'Event description is required.' },
        { status: 400 }
      );
    }

    // Live word count validation (up to 1000 words max)
    const words = countWords(safeDescription);
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

    // Process images
    let finalImages = Array.isArray(imageUrls)
      ? imageUrls
      : Array.isArray(images)
      ? images
      : [];

    let folderId = body.folderId || getFolderIdForDomain(effectiveDomain);

    // If folderUrl was provided and no images were passed, try extracting from drive
    if (finalImages.length === 0 && folderUrl && folderUrl.trim()) {
      const driveResult = await fetchGoogleDriveImages(folderUrl, undefined, effectiveDomain);
      finalImages = driveResult.images || [];
      folderId = driveResult.folderId || folderId;
    }

    const effectiveDate = date || eventDate || new Date().toISOString().split('T')[0];

    const createdEvent = createEventItem({
      title: title.trim(),
      wingId: effectiveDomain.trim(),
      wingName: wingName || effectiveDomain,
      description: safeDescription,
      folderUrl: folderUrl ? folderUrl.trim() : '',
      folderId: folderId || '',
      images: finalImages,
      coverImage: finalImages[0] || body.coverImage || '',
      eventDate: effectiveDate,
      location: location || 'Church Campus, Union Church Bhubaneswar',
      authorName: authorName || 'Church Admin',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Event added and associated with wing domain successfully!',
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
