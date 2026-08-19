import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BookCard from '../../app/components/BookCard.vue'

const meta = {
  title: 'Books/BookCard',
  component: BookCard,

  tags: ['autodocs'],

  parameters: {
    layout: 'centered',
  },

  argTypes: {
    shortlist: {
      action: 'shortlist',
    },
    remove: {
      action: 'remove',
    },
  },
} satisfies Meta<typeof BookCard>

export default meta

type Story = StoryObj<typeof meta>

const book = {
  id: '1',
  title: "Harry Potter and the Philosopher's Stone",
  authors: ['J. K. Rowling'],
  publishedDate: '1997',
  cover:
    'https://covers.openlibrary.org/b/isbn/9780747532699-L.jpg',
  description:
    'Harry Potter discovers that he is a wizard and begins his journey at Hogwarts.',
  publisher: 'Bloomsbury',
  pageCount: 223,
  categories: ['Fantasy', 'Adventure'],
  language: 'en',
  previewLink: '#',
  infoLink: '#',
}

export const Default: Story = {
  args: {
    book,
    isShortlisted: false,
    showRemove: false,
  },
}

export const Shortlisted: Story = {
  args: {
    book,
    isShortlisted: true,
    showRemove: false,
  },
}

export const RemoveFromShortlist: Story = {
  args: {
    book,
    isShortlisted: false,
    showRemove: true,
  },
}

export const NoCover: Story = {
  args: {
    book: {
      ...book,
      cover: undefined,
    },
    isShortlisted: false,
    showRemove: false,
  },
}

export const NoAuthor: Story = {
  args: {
    book: {
      ...book,
      authors: undefined,
    },
    isShortlisted: false,
    showRemove: false,
  },
}

export const NoPublishedDate: Story = {
  args: {
    book: {
      ...book,
      publishedDate: undefined,
    },
    isShortlisted: false,
    showRemove: false,
  },
}