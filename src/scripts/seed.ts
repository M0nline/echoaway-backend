import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  // Protection contre l'exécution en production
  if (process.env.NODE_ENV === 'production') {
    console.log('❌ Seed script disabled in production environment');
    process.exit(0);
  }

  console.log('🌱 Starting database seeding...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepository = app.get(getRepositoryToken(User));

  try {
    // Vérifier si des utilisateurs existent déjà
    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      console.log('⚠️  Users already exist, skipping seed');
      await app.close();
      return;
    }

    // Créer un utilisateur de test simple (ID 1)
    const hashedPassword = await bcrypt.hash('test123', 10);
    const testUser = userRepository.create({
      id: 1,
      email: 'test@echoaway.com',
      password: hashedPassword,
      firstname: 'Test',
      name: 'Utilisateur Test',
      role: 'VISITOR',
      avatar: 'https://via.placeholder.com/150/96CEB4/FFFFFF?text=T'
    });

    await userRepository.save(testUser);
    console.log(`✅ Created test user: ${testUser.name} - ID: ${testUser.id}`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Test account created:');
    console.log('   Test: test@echoaway.com / test123 (ID: 1)');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await app.close();
  }
}

// Exécuter le script
seed().catch(console.error);
