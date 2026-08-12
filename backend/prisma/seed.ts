import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding LearnMemory AI demo data...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create or Upsert Demo User
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@learnmemory.ai' },
    update: {},
    create: {
      email: 'demo@learnmemory.ai',
      name: 'Alex Johnson',
      passwordHash,
    },
  });

  console.log(`👤 Demo User created: ${demoUser.email} (${demoUser.id})`);

  // 2. Create Study Sessions
  const javaSession = await prisma.studySession.create({
    data: {
      userId: demoUser.id,
      title: 'Java OOP Fundamentals',
      subject: 'Java',
      content:
        'Today I reviewed Object-Oriented Programming in Java. Encapsulation makes sense with private fields and getters/setters. Inheritance allows extending parent classes. However, polymorphism and dynamic method dispatch are still confusing to me.',
    },
  });

  const dsaSession = await prisma.studySession.create({
    data: {
      userId: demoUser.id,
      title: 'Binary Search & Arrays',
      subject: 'DSA',
      content:
        'Studied Binary Search on sorted arrays. O(log n) time complexity. I am confident with basic binary search, but recursion-based binary search and pointer boundary movement (left <= right vs left < right) gives me trouble.',
    },
  });

  // 3. Create Topics & Concepts
  const topicOOP = await prisma.topic.upsert({
    where: {
      userId_subject_name: {
        userId: demoUser.id,
        subject: 'Java',
        name: 'OOP',
      },
    },
    update: {},
    create: {
      userId: demoUser.id,
      subject: 'Java',
      name: 'OOP',
    },
  });

  const topicArrays = await prisma.topic.upsert({
    where: {
      userId_subject_name: {
        userId: demoUser.id,
        subject: 'Java',
        name: 'Arrays',
      },
    },
    update: {},
    create: {
      userId: demoUser.id,
      subject: 'Java',
      name: 'Arrays',
    },
  });

  const topicDSA = await prisma.topic.upsert({
    where: {
      userId_subject_name: {
        userId: demoUser.id,
        subject: 'DSA',
        name: 'Binary Search',
      },
    },
    update: {},
    create: {
      userId: demoUser.id,
      subject: 'DSA',
      name: 'Binary Search',
    },
  });

  // Concepts
  await prisma.concept.upsert({
    where: { userId_subject_name: { userId: demoUser.id, subject: 'Java', name: 'Encapsulation' } },
    update: {},
    create: { userId: demoUser.id, subject: 'Java', topicId: topicOOP.id, name: 'Encapsulation', understandingLevel: 'STRONG' },
  });

  await prisma.concept.upsert({
    where: { userId_subject_name: { userId: demoUser.id, subject: 'Java', name: 'Inheritance' } },
    update: {},
    create: { userId: demoUser.id, subject: 'Java', topicId: topicOOP.id, name: 'Inheritance', understandingLevel: 'UNDERSTOOD' },
  });

  await prisma.concept.upsert({
    where: { userId_subject_name: { userId: demoUser.id, subject: 'Java', name: 'Polymorphism' } },
    update: {},
    create: { userId: demoUser.id, subject: 'Java', topicId: topicOOP.id, name: 'Polymorphism', understandingLevel: 'WEAK' },
  });

  await prisma.concept.upsert({
    where: { userId_subject_name: { userId: demoUser.id, subject: 'DSA', name: 'Recursion' } },
    update: {},
    create: { userId: demoUser.id, subject: 'DSA', topicId: topicDSA.id, name: 'Recursion', understandingLevel: 'WEAK' },
  });

  // 4. Create Learning Memories
  await prisma.learningMemory.createMany({
    data: [
      {
        userId: demoUser.id,
        studySessionId: javaSession.id,
        subject: 'Java',
        topic: 'OOP',
        concept: 'Encapsulation',
        summary: 'Data hiding using private modifiers and public getter/setter methods.',
        explanation: 'Encapsulation protects class properties from unauthorized external mutation.',
        keyPoints: JSON.stringify(['Private fields', 'Public getters & setters', 'Data protection']),
        examples: JSON.stringify(['private String name; public String getName() { return name; }']),
        questions: JSON.stringify(['Why use encapsulation instead of public fields?']),
        understandingLevel: 'STRONG',
        confidence: 0.95,
        isWeakArea: false,
      },
      {
        userId: demoUser.id,
        studySessionId: javaSession.id,
        subject: 'Java',
        topic: 'OOP',
        concept: 'Inheritance',
        summary: 'Reusing fields and methods from a superclass using the extends keyword.',
        explanation: 'Allows child classes to inherit state and behavior from a parent class.',
        keyPoints: JSON.stringify(['extends keyword', 'super() constructor call', 'Method overriding']),
        examples: JSON.stringify(['class Dog extends Animal { ... }']),
        questions: JSON.stringify(['What is the difference between overriding and overloading?']),
        understandingLevel: 'UNDERSTOOD',
        confidence: 0.8,
        isWeakArea: false,
      },
      {
        userId: demoUser.id,
        studySessionId: javaSession.id,
        subject: 'Java',
        topic: 'OOP',
        concept: 'Polymorphism',
        summary: 'Ability of an object to take on many forms (dynamic dispatch).',
        explanation: 'Confused about interface polymorphism vs class inheritance overriding.',
        keyPoints: JSON.stringify(['Dynamic method dispatch', 'Interface implementation', 'Runtime vs Compile-time']),
        examples: JSON.stringify(['Animal a = new Dog(); a.makeSound();']),
        questions: JSON.stringify(['How does JVM determine which method to invoke at runtime?']),
        understandingLevel: 'WEAK',
        confidence: 0.4,
        isWeakArea: true,
      },
      {
        userId: demoUser.id,
        studySessionId: dsaSession.id,
        subject: 'DSA',
        topic: 'Binary Search',
        concept: 'Recursion',
        summary: 'Recursive divide-and-conquer implementation of binary search.',
        explanation: 'Struggling with stack call recursion and base conditions.',
        keyPoints: JSON.stringify(['Base case check', 'Midpoint calculation', 'Recursive call with updated pointers']),
        examples: JSON.stringify(['binarySearch(arr, low, mid - 1, target)']),
        questions: JSON.stringify(['When is iterative binary search preferred over recursive?']),
        understandingLevel: 'WEAK',
        confidence: 0.35,
        isWeakArea: true,
      },
    ],
  });

  // 5. Create Weak Areas
  await prisma.weakArea.createMany({
    data: [
      {
        userId: demoUser.id,
        subject: 'Java',
        topic: 'OOP',
        conceptName: 'Polymorphism',
      },
      {
        userId: demoUser.id,
        subject: 'DSA',
        topic: 'Binary Search',
        conceptName: 'Recursion',
      },
    ],
  });

  console.log('✅ Demo seed data successfully created!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
