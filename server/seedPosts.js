// seedPosts.js - Script to seed the database with Nigerian blog posts

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./models/Post');
const Category = require('./models/Category');
const User = require('./models/User');

dotenv.config();

const nigerianPosts = [
  {
    title: "Nigeria's Economy Shows Strong Recovery in Q4 2025",
    content: `Nigeria's economy has demonstrated remarkable resilience with a 3.5% GDP growth in the fourth quarter of 2025. The recovery is largely driven by the non-oil sector, particularly agriculture and telecommunications.

The agricultural sector has seen significant improvements with increased yields in rice, cassava, and yam production. The government's investment in irrigation infrastructure and distribution of improved seedlings has paid off tremendously.

The technology sector continues to boom, with Lagos emerging as one of Africa's leading tech hubs. Numerous startups have secured substantial funding, creating thousands of jobs for young Nigerians.

Financial experts predict sustained growth into 2026, citing improved security conditions, better infrastructure, and increased foreign direct investment as key factors.`,
    excerpt: "Nigeria's economy demonstrates remarkable resilience with 3.5% GDP growth driven by agriculture and tech sectors.",
    featuredImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80",
    tags: ["Economy", "Business", "GDP", "Technology"],
    isPublished: true,
    category: "Business",
  },
  {
    title: "Lagos-Ibadan Rail Project Fully Operational",
    content: `The much-anticipated Lagos-Ibadan standard gauge railway has commenced full commercial operations, marking a new era in Nigeria's transportation infrastructure.

Passengers can now travel between Lagos and Ibadan in just 2 hours, compared to the previous 4-5 hours by road. The modern trains feature air-conditioned coaches, WiFi connectivity, and comfortable seating arrangements.

The project has created over 5,000 direct jobs and numerous indirect employment opportunities. Local communities along the route are already experiencing economic benefits from increased trade and tourism.

Transportation Minister announced plans to extend the railway to Kano, with construction expected to begin in early 2026. This is part of the government's broader vision to modernize Nigeria's railway system.`,
    excerpt: "Lagos-Ibadan railway now fully operational, cutting travel time in half with modern amenities and WiFi.",
    featuredImage: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80",
    tags: ["Infrastructure", "Transportation", "Development"],
    isPublished: true,
    category: "News",
  },
  {
    title: "Nigerian Tech Startup Raises $50M in Series B Funding",
    content: `Flutterwave's success story continues to inspire as another Nigerian fintech startup, PayStack Plus, has secured $50 million in Series B funding from international investors.

The funding round was led by prominent Silicon Valley venture capital firms, highlighting growing confidence in Nigeria's tech ecosystem. The startup plans to use the funds to expand operations across West Africa and develop new payment solutions.

PayStack Plus has processed over $2 billion in transactions since its launch and serves more than 100,000 businesses across Nigeria. The platform's innovative approach to mobile payments has revolutionized how small businesses accept payments.

CEO Chioma Adeleke stated that the funding will help them onboard one million new merchants by the end of 2026 and launch their services in Ghana, Kenya, and South Africa.`,
    excerpt: "Nigerian fintech startup secures $50M funding to expand across West Africa and innovate payment solutions.",
    featuredImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80",
    tags: ["Technology", "Fintech", "Startup", "Investment"],
    isPublished: true,
    category: "Technology",
  },
  {
    title: "Nigeria's Creative Industry Booms with Nollywood Exports",
    content: `Nollywood continues its global expansion with Netflix and Amazon Prime acquiring rights to 50 new Nigerian films and series for international distribution.

The Nigerian film industry is now valued at over $6 billion annually, making it the second-largest film producer in the world by volume. Nigerian content is gaining massive popularity in the Caribbean, Asia, and throughout Africa.

Award-winning director Kunle Afolayan's latest production has been selected for the Cannes Film Festival, showcasing Nigeria's growing influence in global cinema. The film explores contemporary Nigerian society while addressing universal themes of family and identity.

The music industry is equally vibrant, with Afrobeats artists like Burna Boy, Wizkid, and Tems topping international charts. The genre's influence can be heard in mainstream pop music worldwide.`,
    excerpt: "Nollywood films secure major streaming deals as Nigerian entertainment industry reaches $6 billion valuation.",
    featuredImage: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
    tags: ["Entertainment", "Nollywood", "Culture", "Music"],
    isPublished: true,
    category: "Entertainment",
  },
  {
    title: "Super Eagles Qualify for 2026 World Cup",
    content: `The Nigerian national football team, the Super Eagles, has secured qualification for the 2026 FIFA World Cup after a thrilling 2-1 victory over South Africa in Uyo.

Star striker Victor Osimhen scored both goals, bringing his tally to 12 goals in the qualifying campaign. The victory sent the Godswill Akpabio Stadium into wild celebrations as thousands of fans rejoiced.

Coach José Peseiro praised the team's unity and determination, highlighting the blend of experienced players and emerging talents. The squad includes stars from top European leagues including Premier League, Serie A, and La Liga.

Nigeria will be making its seventh World Cup appearance, and fans are optimistic about the team's chances given their recent form. Preparations are already underway with friendly matches scheduled against Brazil and Argentina.`,
    excerpt: "Super Eagles secure World Cup 2026 spot with Victor Osimhen's brace against South Africa.",
    featuredImage: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
    tags: ["Sports", "Football", "World Cup", "Super Eagles"],
    isPublished: true,
    category: "Sports",
  },
  {
    title: "Nigerian Scientists Develop Revolutionary Malaria Vaccine",
    content: `Researchers at the University of Lagos Teaching Hospital have developed a groundbreaking malaria vaccine that shows 95% efficacy in clinical trials.

The vaccine, named "MalStop", represents a major breakthrough in the fight against malaria, which affects millions of Africans annually. Unlike previous vaccines, MalStop requires only a single dose and provides long-lasting immunity.

The research team, led by Professor Ngozi Okonjo, collaborated with international partners and received funding from the Bill & Melinda Gates Foundation. The vaccine has been fast-tracked for approval by Nigerian health authorities.

If approved, mass production will begin at a new pharmaceutical facility in Abuja, creating hundreds of jobs and reducing Nigeria's dependence on imported medicines. The WHO has expressed interest in recommending the vaccine for use across Africa.`,
    excerpt: "Nigerian researchers develop 95% effective malaria vaccine in major medical breakthrough for Africa.",
    featuredImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    tags: ["Health", "Science", "Medical", "Innovation"],
    isPublished: true,
    category: "Health",
  },
  {
    title: "Abuja Smart City Initiative Transforms Capital",
    content: `The Federal Capital Territory Administration has launched an ambitious smart city initiative, transforming Abuja into one of Africa's most technologically advanced cities.

The project includes installation of 10,000 smart streetlights with integrated CCTV cameras, free public WiFi in major areas, and an intelligent traffic management system. Citizens can now report issues and access government services through a mobile app.

Solar-powered charging stations have been installed across the city, supporting the growing adoption of electric vehicles. The initiative aims to make Abuja carbon-neutral by 2030.

Governor Wike announced that the success of this pilot program will inform similar projects in Lagos, Port Harcourt, and Kano. International development partners have praised Nigeria's commitment to sustainable urban development.`,
    excerpt: "Abuja's smart city transformation brings free WiFi, intelligent traffic systems, and sustainable infrastructure.",
    featuredImage: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80",
    tags: ["Technology", "Smart City", "Infrastructure", "Innovation"],
    isPublished: true,
    category: "Technology",
  },
  {
    title: "Nigerian Students Excel at International Science Olympiad",
    content: `A team of Nigerian students has won gold medals at the 2025 International Science Olympiad held in Tokyo, Japan, competing against teams from 95 countries.

The students from Queens College Lagos and King's College Lagos demonstrated exceptional knowledge in physics, chemistry, and biology. Their outstanding performance has been celebrated across the nation.

Minister of Education praised the achievement, noting that increased investment in STEM education is yielding results. The government has announced scholarships for all gold medalists to pursue their university education.

The students credited their success to dedicated teachers, improved laboratory facilities, and support from their families. They hope to inspire other Nigerian youth to pursue careers in science and technology.`,
    excerpt: "Nigerian students win gold at International Science Olympiad, showcasing excellence in STEM education.",
    featuredImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    tags: ["Education", "STEM", "Youth", "Achievement"],
    isPublished: true,
    category: "Education",
  },
  {
    title: "Eko Atlantic City Nears Completion",
    content: `The Eko Atlantic City project, one of Africa's most ambitious urban development initiatives, is nearing completion with over 80% of infrastructure now in place.

The new city, built on reclaimed land adjacent to Victoria Island, Lagos, features state-of-the-art commercial buildings, residential towers, and a modern business district. It's designed to house 250,000 residents and accommodate 150,000 commuters daily.

The city includes advanced flood protection systems, underground utilities, and smart building technology. Major international companies have already secured office space in the new financial district.

Developers report strong interest from both local and foreign investors. The project is expected to create 250,000 jobs directly and indirectly, boosting Lagos's position as West Africa's economic powerhouse.`,
    excerpt: "Eko Atlantic City nearing completion as Lagos prepares for Africa's newest smart business district.",
    featuredImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    tags: ["Real Estate", "Development", "Lagos", "Business"],
    isPublished: true,
    category: "Business",
  },
  {
    title: "Nigeria Launches National Digital Identity Platform",
    content: `The Nigerian government has officially launched its comprehensive National Digital Identity Platform, aimed at providing seamless digital services to all citizens.

The platform integrates the National Identity Number (NIN) with various government services, enabling citizens to access healthcare, education, and financial services through a single digital identity.

Over 100 million Nigerians have enrolled in the system, which uses advanced biometric technology and blockchain for security. The platform has already reduced bureaucratic delays and improved service delivery.

Financial inclusion experts note that the digital identity system will enable millions of previously unbanked Nigerians to access formal financial services. The World Bank has cited Nigeria's system as a model for other developing nations.`,
    excerpt: "Nigeria's new digital identity platform integrates services for 100M citizens, boosting financial inclusion.",
    featuredImage: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80",
    tags: ["Technology", "Digital Identity", "Innovation", "Government"],
    isPublished: true,
    category: "Technology",
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create categories if they don't exist
    const categoryNames = ['News', 'Business', 'Technology', 'Entertainment', 'Sports', 'Health', 'Education'];
    const categories = {};

    for (const categoryName of categoryNames) {
      let category = await Category.findOne({ name: categoryName });
      if (!category) {
        category = await Category.create({
          name: categoryName,
          slug: categoryName.toLowerCase(),
          description: `Posts about ${categoryName}`,
        });
        console.log(`Created category: ${categoryName}`);
      }
      categories[categoryName] = category._id;
    }

    // Create a default author if none exists
    let author = await User.findOne({ email: 'admin@topmanblog.com' });
    if (!author) {
      author = await User.create({
        username: 'Admin',
        email: 'admin@topmanblog.com',
        password: 'Admin@123', // This will be hashed by the pre-save hook
      });
      console.log('Created default author');
    }

    // Clear existing posts (optional - comment out if you want to keep existing posts)
    // await Post.deleteMany({});
    // console.log('Cleared existing posts');

    // Create posts
    for (const postData of nigerianPosts) {
      const categoryId = categories[postData.category];
      
      // Check if post already exists
      const existingPost = await Post.findOne({ title: postData.title });
      if (existingPost) {
        console.log(`Post already exists: ${postData.title}`);
        continue;
      }

      // Generate slug from title
      const slug = postData.title
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');

      const post = await Post.create({
        ...postData,
        slug: slug,
        author: author._id,
        category: categoryId,
      });

      console.log(`Created post: ${post.title}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log(`📝 Total posts created: ${nigerianPosts.length}`);
    console.log('\n🔐 Login credentials:');
    console.log('Email: admin@topmanblog.com');
    console.log('Password: Admin@123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
