import asyncio

from app.db.mongo import get_db


async def seed():
    db = get_db()

    await db.cafe_profile.delete_many({})
    await db.reviews.delete_many({})
    await db.books.delete_many({})
    await db.menu_items.delete_many({})

    await db.cafe_profile.insert_one(
        {
            "name": "The Turning Page Cafe",
            "concept": "A calm reading space where every table has books, soft music, and handcrafted coffee.",
            "location": "Maple Street, Koregaon Park, Pune",
            "hours": "8:00 AM - 9:00 PM",
            "contact": "+91 98765 43210",
            "average_rating": 4.7,
        }
    )

    await db.reviews.insert_many(
        [
            {"reviewer_name": "Aarav", "rating": 4.8, "comment": "Great coffee and amazing fiction corner."},
            {"reviewer_name": "Mira", "rating": 4.6, "comment": "Perfect for weekend reading dates."},
            {"reviewer_name": "Kabir", "rating": 4.7, "comment": "Friendly staff and quiet atmosphere."},
        ]
    )

    await db.books.insert_many(
        [
            {"title": "The Alchemist", "author": "Paulo Coelho", "genre": "Fiction", "available": True},
            {"title": "The Kite Runner", "author": "Khaled Hosseini", "genre": "Fiction", "available": True},
            {"title": "Norwegian Wood", "author": "Haruki Murakami", "genre": "Fiction", "available": False},
            {"title": "A Man Called Ove", "author": "Fredrik Backman", "genre": "Fiction", "available": True},
            {"title": "Atomic Habits", "author": "James Clear", "genre": "Self-Help", "available": True},
            {"title": "Deep Work", "author": "Cal Newport", "genre": "Self-Help", "available": True},
            {"title": "The Power of Now", "author": "Eckhart Tolle", "genre": "Self-Help", "available": True},
            {"title": "Can't Hurt Me", "author": "David Goggins", "genre": "Self-Help", "available": False},
            {"title": "Sapiens", "author": "Yuval Noah Harari", "genre": "History", "available": False},
            {"title": "Guns, Germs, and Steel", "author": "Jared Diamond", "genre": "History", "available": True},
            {"title": "The Silk Roads", "author": "Peter Frankopan", "genre": "History", "available": True},
            {"title": "Dune", "author": "Frank Herbert", "genre": "Science Fiction", "available": True},
            {"title": "Project Hail Mary", "author": "Andy Weir", "genre": "Science Fiction", "available": True},
            {"title": "The Left Hand of Darkness", "author": "Ursula K. Le Guin", "genre": "Science Fiction", "available": True},
            {"title": "Neuromancer", "author": "William Gibson", "genre": "Science Fiction", "available": False},
            {"title": "The Silent Patient", "author": "Alex Michaelides", "genre": "Thriller", "available": True},
            {"title": "Gone Girl", "author": "Gillian Flynn", "genre": "Thriller", "available": True},
            {"title": "The Girl with the Dragon Tattoo", "author": "Stieg Larsson", "genre": "Thriller", "available": True},
            {"title": "Big Little Lies", "author": "Liane Moriarty", "genre": "Thriller", "available": True},
            {"title": "Pride and Prejudice", "author": "Jane Austen", "genre": "Classics", "available": True},
            {"title": "1984", "author": "George Orwell", "genre": "Classics", "available": True},
            {"title": "To Kill a Mockingbird", "author": "Harper Lee", "genre": "Classics", "available": True},
            {"title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "genre": "Classics", "available": False},
            {"title": "Educated", "author": "Tara Westover", "genre": "Biography", "available": True},
            {"title": "Becoming", "author": "Michelle Obama", "genre": "Biography", "available": True},
            {"title": "The Diary of a Young Girl", "author": "Anne Frank", "genre": "Biography", "available": True},
            {"title": "Milk and Honey", "author": "Rupi Kaur", "genre": "Poetry", "available": True},
            {"title": "The Sun and Her Flowers", "author": "Rupi Kaur", "genre": "Poetry", "available": True},
            {"title": "Caraval", "author": "Stephanie Garber", "genre": "Fantasy", "available": True},
            {"title": "The Name of the Wind", "author": "Patrick Rothfuss", "genre": "Fantasy", "available": True},
            {"title": "The Hobbit", "author": "J.R.R. Tolkien", "genre": "Fantasy", "available": True},
        ]
    )

    await db.menu_items.insert_many(
        [
            {"name": "Cappuccino", "category": "Coffee", "price": 180, "icon": "coffee"},
            {"name": "Caramel Latte", "category": "Coffee", "price": 220, "icon": "coffee"},
            {"name": "Espresso", "category": "Coffee", "price": 140, "icon": "coffee"},
            {"name": "Americano", "category": "Coffee", "price": 150, "icon": "coffee"},
            {"name": "Mocha", "category": "Coffee", "price": 230, "icon": "coffee"},
            {"name": "Flat White", "category": "Coffee", "price": 200, "icon": "coffee"},
            {"name": "Masala Chai", "category": "Tea", "price": 90, "icon": "cup"},
            {"name": "Green Tea", "category": "Tea", "price": 85, "icon": "cup"},
            {"name": "Earl Grey", "category": "Tea", "price": 95, "icon": "cup"},
            {"name": "Lemon Ginger Tea", "category": "Tea", "price": 100, "icon": "cup"},
            {"name": "Cold Brew", "category": "Cold Beverages", "price": 210, "icon": "glass"},
            {"name": "Iced Latte", "category": "Cold Beverages", "price": 200, "icon": "glass"},
            {"name": "Fresh Lime Soda", "category": "Cold Beverages", "price": 120, "icon": "glass"},
            {"name": "Berry Smoothie", "category": "Cold Beverages", "price": 240, "icon": "glass"},
            {"name": "Paneer Sandwich", "category": "Snacks", "price": 170, "icon": "sandwich"},
            {"name": "Grilled Cheese", "category": "Snacks", "price": 150, "icon": "sandwich"},
            {"name": "Veg Club Sandwich", "category": "Snacks", "price": 190, "icon": "sandwich"},
            {"name": "Hummus & Pita", "category": "Snacks", "price": 160, "icon": "sandwich"},
            {"name": "French Fries", "category": "Snacks", "price": 130, "icon": "sandwich"},
            {"name": "Chocolate Brownie", "category": "Desserts", "price": 160, "icon": "cake"},
            {"name": "Cheesecake Slice", "category": "Desserts", "price": 220, "icon": "cake"},
            {"name": "Banoffee Pie", "category": "Desserts", "price": 200, "icon": "cake"},
            {"name": "Blueberry Muffin", "category": "Desserts", "price": 140, "icon": "cake"},
            {"name": "Chocolate Chip Cookie", "category": "Desserts", "price": 90, "icon": "cake"},
        ]
    )

    print("Seed completed.")


if __name__ == "__main__":
    asyncio.run(seed())
