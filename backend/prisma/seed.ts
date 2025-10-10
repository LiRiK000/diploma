import { prisma } from "../src/lib/prisma";

const genres = [
  { value: "novel", label: "Роман" },
  { value: "story", label: "Повесть" },
  { value: "short_story", label: "Рассказ" },
  { value: "detective", label: "Детектив" },
  { value: "fantasy", label: "Фэнтези" },
  { value: "sci_fi", label: "Научная фантастика" },
  { value: "adventure", label: "Приключения" },
  { value: "biography", label: "Биография" },
  { value: "autobiography", label: "Автобиография" },
  { value: "historical", label: "Историческая литература" },
  { value: "poetry", label: "Поэзия" },
  { value: "drama", label: "Драма" },
  { value: "tragedy", label: "Трагедия" },
  { value: "comedy", label: "Комедия" },
  { value: "horror", label: "Ужасы" },
  { value: "thriller", label: "Триллер" },
  { value: "mystery", label: "Мистика" },
  { value: "psychological", label: "Психологический роман" },
  { value: "romance", label: "Любовный роман" },
  { value: "philosophical", label: "Философская литература" },
  { value: "essay", label: "Эссе" },
  { value: "journalism", label: "Публицистика" },
  { value: "documentary", label: "Документальная проза" },
  { value: "satire", label: "Сатира" },
  { value: "dystopia", label: "Антиутопия" },
  { value: "utopia", label: "Утопия" },
  { value: "children", label: "Детская литература" },
  { value: "folklore", label: "Фольклор" },
  { value: "classic", label: "Классика" },
  { value: "modern", label: "Современная проза" },
];

async function main() {
  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { value: genre.value },
      update: {},
      create: genre,
    });
  }
  console.log("✅ Genres seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
