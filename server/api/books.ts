interface GoogleBookItem {
  id: string
  volumeInfo?: {
    title?: string
    authors?: string[]
    publishedDate?: string
    description?: string
    imageLinks?: {
      thumbnail?: string
      smallThumbnail?: string
    }
    publisher?: string
    pageCount?: number
    categories?: string[]
    language?: string
    previewLink?: string
    infoLink?: string
  }
}

interface GoogleBooksResponse {
  totalItems?: number
  items?: GoogleBookItem[]
}

interface Book {
  id: string
  title: string
  authors: string[]
  publishedDate: string
  cover: string
  description: string
  publisher: string
  pageCount: number
  categories: string[]
  language: string
  previewLink: string
  infoLink: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const query = getQuery(event)

  const search = String(query.q || 'books')

  try {
    const response = await $fetch<GoogleBooksResponse>(
      'https://www.googleapis.com/books/v1/volumes',
      {
        params: {
          q: search,
          maxResults: 20,
          key: config.googleBooksApiKey
        }
      }
    )

    const books: Book[] = (response.items || []).map(
      (item) => {
        const volumeInfo = item.volumeInfo || {}

        return {
          id: item.id,

          title:
            volumeInfo.title ||
            'Unknown Title',

          authors:
            volumeInfo.authors ||
            ['Unknown Author'],

          publishedDate:
            volumeInfo.publishedDate ||
            '',

          cover:
            volumeInfo.imageLinks?.thumbnail ||
            volumeInfo.imageLinks?.smallThumbnail ||
            '',

          description:
            volumeInfo.description ||
            'No description available.',

          publisher:
            volumeInfo.publisher ||
            'Unknown Publisher',

          pageCount:
            volumeInfo.pageCount ||
            0,

          categories:
            volumeInfo.categories ||
            [],

          language:
            volumeInfo.language ||
            '',

          previewLink:
            volumeInfo.previewLink ||
            '',

          infoLink:
            volumeInfo.infoLink ||
            ''
        }
      }
    )

    return {
      total: response.totalItems || 0,
      books,
      source: 'Google Books API'
    }
  } catch (error) {
    console.error(
      'Failed to fetch books:',
      error
    )

    throw createError({
      statusCode: 500,
      statusMessage:
        'Failed to fetch books from Google Books API'
    })
  }
})