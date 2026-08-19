<script setup lang="ts">
interface Book {
  id: string;
  title: string;
  authors?: string[];
  publishedDate?: string;
  cover?: string;
}

const SHORTLIST_KEY = "shortlisted-books";

const shortlistedBooks = ref<Book[]>([]);

// Emit

const emit = defineEmits<{ goBack: [] }>();

// Load Shortlisted Books

const loadShortlistedBooks = () => {
  if (!import.meta.client) {
    return;
  }

  try {
    const storedBooks = localStorage.getItem(SHORTLIST_KEY);

    if (!storedBooks) {
      shortlistedBooks.value = [];
      return;
    }

    const parsedBooks = JSON.parse(storedBooks);

    shortlistedBooks.value = Array.isArray(parsedBooks) ? parsedBooks : [];
  } catch (error) {
    console.error("Failed to load shortlisted books:", error);

    shortlistedBooks.value = [];
  }
};

// Remove Book

const removeShortlistedBook = (book: Book) => {
  shortlistedBooks.value = shortlistedBooks.value.filter(
    (item) => item.id !== book.id,
  );

  localStorage.setItem(SHORTLIST_KEY, JSON.stringify(shortlistedBooks.value));
};

//  Go Back

const goBack = () => {
  emit("goBack");
};

//  Initial Load

onMounted(() => {
  loadShortlistedBooks();
});
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <div class="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <!-- Header -->

      <header
        class="mb-8 flex items-center justify-between border-b border-slate-200 pb-6"
      >
        <div class="flex items-center gap-3">
          <!-- Star -->

          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-5 w-5 text-amber-500"
              aria-hidden="true"
            >
              <path
                d="m12 2.75 2.91 5.9 6.51.95-4.71 4.59 1.11 6.48L12 17.61l-5.82 3.06 1.11-6.48-4.71-4.59 6.51-.95L12 2.75Z"
              />
            </svg>
          </div>

          <div>
            <h1
              class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
            >
              {{
                shortlistedBooks.length === 1
                  ? "Shortlisted Book"
                  : "Shortlisted Books"
              }}
              <span>
                ({{
                  shortlistedBooks.length === 0
                    ? "0"
                    : shortlistedBooks.length < 10
                      ? `0${shortlistedBooks.length}`
                      : shortlistedBooks.length
                }})
              </span>
            </h1>

            <p class="mt-1 text-sm text-slate-500">Your saved books</p>
          </div>
        </div>

        <!-- Back Button -->

        <button
          v-if="shortlistedBooks.length"
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600"
          @click="goBack"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="h-4 w-4"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>

          Discover Books
        </button>
      </header>

      <!--  Book Count -->

      <div
        v-if="shortlistedBooks.length"
        class="mb-6 flex items-center justify-between"
      >
        <!-- <p class="text-sm text-slate-500">
          Saved books
        </p>-->

        <!-- <span
          class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
        >
          {{
            shortlistedBooks.length === 0
              ? '0'
              : shortlistedBooks.length < 10
                ? `0${shortlistedBooks.length}`
                : shortlistedBooks.length
          }}
          {{
            shortlistedBooks.length === 1
              ? 'Book'
              : 'Books'
          }}
        </span> -->
      </div>

      <!-- Shortlisted Books -->

      <div
        v-if="shortlistedBooks.length"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        <BookCard
          v-for="book in shortlistedBooks"
          :key="book.id"
          :book="book"
          :is-shortlisted="true"
          :show-remove="true"
          @remove="removeShortlistedBook"
        />
      </div>

      <!--  Empty State -->

      <div
        v-else
        class="flex min-h-[420px] items-center justify-center rounded-xl border border-slate-200 bg-white"
      >
        <div class="max-w-md px-6 text-center">
          <!-- Star -->

          <div
            class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-7 w-7 text-amber-500"
              aria-hidden="true"
            >
              <path
                d="m12 2.75 2.91 5.9 6.51.95-4.71 4.59 1.11 6.48L12 17.61l-5.82 3.06 1.11-6.48-4.71-4.59 6.51-.95L12 2.75Z"
              />
            </svg>
          </div>

          <h2 class="mt-5 text-lg font-semibold text-slate-900">
            No shortlisted books
          </h2>

          <p class="mt-2 text-sm text-slate-500">
            You haven't shortlisted any books yet.
          </p>

          <!-- Discover Books -->

          <button
            type="button"
            class="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600"
            @click="goBack"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="h-4 w-4"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>

            Discover Books
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
