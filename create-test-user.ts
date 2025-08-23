import { db } from './server/db';
import { users } from './shared/schema';

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    const result = await db
      .insert(users)
      .values({
        username: 'testuser',
        email: 'test@example.com',
        bio: 'Test user for debugging'
      })
      .returning();
      
    console.log('Test user created:', result[0]);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    process.exit(0);
  }
}

createTestUser();