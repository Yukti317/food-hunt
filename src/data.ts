export interface Level {
  id: number;
  stallName: string;
  hint: string;
  message: string;
  emoji: string;
  color: string;
  x: number;
  y: number;
}

export const FAIR_STALLS: Level[] = [
  {
    id: 1,
    stallName: "Aunty de Parathe",
    hint: "The smell of fresh ghee and hot tawas. Look for the stall with the longest queue and the warmest smiles!",
    message: "This place is very special to me because we had dinner here when we met for the first time. After a long time, despite my past behavior and avoiding him, we finally met—and that moment made me understand what true friendship really feels like.🤎",
    emoji: "🍜",
    color: "#f59e0b",
    x: 15,
    y: 15
  },
  {
    id: 2,
    stallName: "Iscon Temple",
    hint: "A place of peace amidst the fair's chaos. Listen for the faint sound of bells and spiritual calm.",
    message: "We used to meet here after office, which always made me excited. We would take darshan, sit for a while, then head to Jay Ambe for dinner—enjoying food together while sitting on khatla. Those simple moments were really special.😁",
    emoji: "🛕",
    color: "#fb923c",
    x: 85,
    y: 15
  },
  {
    id: 3,
    stallName: "Navrang Stall or My Office",
    hint: "The most colorful spot in the fair! If you're looking for that specific snack we always fight over, it's here.",
    message: "After you joined the new office, we used to meet at Navrang or my office—the place where we tried waffles together for the first time (even though you didn’t like them before!), along with momos and cholafali. So many fun memories and emotions are attached to this place… I really miss those moments now after changing my office.",
    emoji: "🏢",
    color: "#8b5cf6",
    x: 15,
    y: 85
  },
  {
    id: 4,
    stallName: "Pani Puri Stall",
    hint: "Crunchy, spicy, and perfectly tangy. You know the one—the stall where we see who can handle the most spice!",
    message: "Pani puri is something special for us—it’s not just food, it’s emotions. From sharing masala plates to eating it even during tough times, pani puri has always been our constant. It’s simple, but full of memories… truly our kind of love.",
    emoji: "🥙",
    color: "#10b981",
    x: 85,
    y: 85
  },
  {
    id: 5,
    stallName: "Happy Birthday... Duduu(Mari Benpaniii..😘).",
    hint: "The most special moment—celebrating you. ✨",
    message: "You’re not just my friend, you’re someone really close to my heart. Life feels lighter and happier with you around. Thank you for always being there and making everything better. I’m truly lucky to have you. 💛 Happy BirthDay Rahul(Puchhuu 🐥). I hope you have a fantastic day filled with love, laughter, and all the things that make you happy. You deserve the best! 🎉",
    emoji: "🎊",
    color: "#ef4444",
    x: 50,
    y: 50
  }
];
