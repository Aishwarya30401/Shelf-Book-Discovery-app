<template>
  <header
    class="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
      <!-- Logo -->

      <div class="flex shrink-0 items-center gap-2" aria-label="Shelf">
        <!-- Book Icon -->

        <span
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4f46e5] text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            class="h-6 w-6"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
            />

            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"
            />

            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8 6h8M8 10h6"
            />
          </svg>
        </span>

        <span class="text-xl font-bold tracking-tight text-slate-900">
          Shelf
        </span>
      </div>
    </div>
  </header>
</template>
