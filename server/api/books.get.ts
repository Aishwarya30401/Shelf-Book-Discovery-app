interface GoogleBooksVolume {
  id: string

  volumeInfo?: {
    title?: string
    authors?: string[]
    publishedDate?: string
    description?: string
    pageCount?: number
    categories?: string[]

    imageLinks?: {
      thumbnail?: string
      smallThumbnail?: string
    }
  }
}

interface GoogleBooksResponse {
  totalItems?: number
  items?: GoogleBooksVolume[]
}

interface Book {
  id: string
  title: string
  authors: string[]
  publishedDate: string
  cover: string
  description: string
  pageCount: number
  categories: string[]
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

    const books: Book[] = (response.items || []).map((item) => {
      const volumeInfo = item.volumeInfo

      const cover =
        volumeInfo?.imageLinks?.thumbnail ||
        volumeInfo?.imageLinks?.smallThumbnail ||
        ''

      return {
        id: item.id,

        title:
          volumeInfo?.title ||
          'Untitled',

        authors:
          volumeInfo?.authors ||
          [],

        publishedDate:
          volumeInfo?.publishedDate ||
          '',

        cover:
          cover.replace(/^http:/, 'https:'),

        description:
          volumeInfo?.description ||
          'No description available.',

        pageCount:
          volumeInfo?.pageCount ||
          0,

        categories:
          volumeInfo?.categories ||
          []
      }
    })

    return {
      total: response.totalItems ?? books.length,
      books,
      source: 'google-books'
    }
  } catch (error: any) {
    console.error('GOOGLE BOOKS ERROR:', error)

    throw createError({
      statusCode: error?.response?.status || 502,
      statusMessage: 'Failed to fetch books',
      data: error?.data || error?.message
    })
  }
})