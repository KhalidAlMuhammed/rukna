-- ============================================================================
-- RUKNA SAMPLE DATA
-- Demo data to showcase the AI-powered tourist-guide matching platform
-- ============================================================================

-- Clean existing sample data (optional - remove if you want to keep existing data)
-- DELETE FROM messages WHERE true;
-- DELETE FROM bookings WHERE true;
-- DELETE FROM experiences WHERE true;
-- DELETE FROM ai_embeddings WHERE true;
-- DELETE FROM guide_profiles WHERE true;
-- DELETE FROM tourist_profiles WHERE true;
-- DELETE FROM profiles WHERE email LIKE '%@demo.rukna%';

-- ============================================================================
-- SAMPLE PROFILES (Base user data)
-- ============================================================================

-- Tourist Profiles
INSERT INTO profiles (id, email, full_name, user_type, location, avatar_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'sarah.explorer@demo.rukna', 'Sarah Al-Mansouri', 'tourist', 'Riyadh', 'https://images.unsplash.com/photo-1494790108755-2616b332c495?w=400'),
('550e8400-e29b-41d4-a716-446655440002', 'mike.adventurer@demo.rukna', 'Mike Johnson', 'tourist', 'International', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'),
('550e8400-e29b-41d4-a716-446655440003', 'fatima.culture@demo.rukna', 'Fatima Al-Zahra', 'tourist', 'Jeddah', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'),
('550e8400-e29b-41d4-a716-446655440004', 'alex.photographer@demo.rukna', 'Alex Chen', 'tourist', 'International', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'),
('550e8400-e29b-41d4-a716-446655440005', 'layla.foodie@demo.rukna', 'Layla Al-Harbi', 'tourist', 'Dammam', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400');

-- Guide Profiles  
INSERT INTO profiles (id, email, full_name, user_type, location, avatar_url) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'ahmed.mountain@demo.rukna', 'Ahmed Al-Ghamdi', 'guide', 'Abha', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400'),
('550e8400-e29b-41d4-a716-446655440011', 'nora.heritage@demo.rukna', 'Nora Al-Shahrani', 'guide', 'Khamis Mushait', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400'),
('550e8400-e29b-41d4-a716-446655440012', 'omar.cuisine@demo.rukna', 'Omar Al-Asiri', 'guide', 'Rijal Almaa', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400'),
('550e8400-e29b-41d4-a716-446655440013', 'maryam.spiritual@demo.rukna', 'Maryam Al-Qadhi', 'guide', 'Abha', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400'),
('550e8400-e29b-41d4-a716-446655440014', 'salem.nature@demo.rukna', 'Salem Al-Dosari', 'guide', 'Tanoumah', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400');

-- ============================================================================
-- TOURIST PROFILES (Tourist-specific preferences)
-- ============================================================================

INSERT INTO tourist_profiles (id, interests, budget_range, group_size_preference, activity_level, travel_style) VALUES
('550e8400-e29b-41d4-a716-446655440001', '{"adventure", "nature", "photography"}', 'premium', 2, 'high', 'Love challenging hikes and capturing stunning mountain views. Always seeking unique perspectives and hidden gems.'),
('550e8400-e29b-41d4-a716-446655440002', '{"adventure", "cultural", "historical"}', 'moderate', 4, 'high', 'International traveler passionate about authentic experiences and local stories. Enjoy active exploration with cultural depth.'),
('550e8400-e29b-41d4-a716-446655440003', '{"cultural", "spiritual", "traditional_crafts"}', 'budget', 1, 'low', 'Solo traveler seeking peaceful, meaningful experiences. Interested in learning traditional arts and connecting with local wisdom.'),
('550e8400-e29b-41d4-a716-446655440004', '{"photography", "nature", "cultural"}', 'premium', 3, 'medium', 'Professional photographer documenting authentic Saudi culture. Looking for exclusive access and unique perspectives.'),
('550e8400-e29b-41d4-a716-446655440005', '{"food", "cultural", "local_cuisine"}', 'moderate', 2, 'medium', 'Food enthusiast exploring regional cuisines. Love cooking classes and discovering family recipes passed down through generations.');

-- ============================================================================
-- GUIDE PROFILES (Guide expertise and details)
-- ============================================================================

INSERT INTO guide_profiles (
    id, bio, specialties, languages_spoken, years_experience, 
    verification_status, is_active, service_areas, max_group_size, 
    has_transportation, average_rating, total_reviews, total_bookings
) VALUES
('550e8400-e29b-41d4-a716-446655440010', 
 'Born and raised in the Asir mountains, I''ve been guiding adventures for 8 years. My passion is sharing the breathtaking beauty of Jabal Sawda and the hidden trails that only locals know. I specialize in challenging mountain expeditions and wildlife photography tours.',
 '{"adventure", "hiking", "photography", "nature", "wildlife"}',
 '{"Arabic", "English"}',
 8, 'approved', true, 
 '{"Abha", "Jabal Sawda", "Al Namas", "Tanoumah"}',
 6, true, 4.9, 127, 89),

('550e8400-e29b-41d4-a716-446655440011',
 'Cultural heritage specialist with deep knowledge of Asir''s rich traditions. I teach traditional crafts, tell ancient stories, and help visitors understand our unique architectural heritage. My family has lived in this region for generations.',
 '{"cultural", "traditional_crafts", "heritage", "storytelling", "architecture"}',
 '{"Arabic", "English", "French"}',
 6, 'approved', true,
 '{"Khamis Mushait", "Abha", "Rijal Almaa"}',
 8, false, 4.8, 94, 76),

('550e8400-e29b-41d4-a716-446655440012',
 'Third-generation chef specializing in authentic Asiri cuisine. I offer immersive cooking experiences where you''ll learn to prepare traditional dishes using recipes passed down through my family. From Asiri bread to mountain honey specialties.',
 '{"food", "cooking", "cultural", "local_cuisine", "traditional_recipes"}',
 '{"Arabic", "English"}',
 5, 'approved', true,
 '{"Rijal Almaa", "Abha", "Khamis Mushait"}',
 4, true, 4.9, 156, 134),

('550e8400-e29b-41d4-a716-446655440013',
 'Spiritual guide and meditation teacher helping visitors connect with the peaceful energy of Asir''s sacred sites. I lead mindful journeys to ancient mosques, meditation sessions in mountain retreats, and spiritual wellness experiences.',
 '{"spiritual", "meditation", "wellness", "cultural", "mindfulness"}',
 '{"Arabic", "English", "Urdu"}',
 4, 'approved', true,
 '{"Abha", "Khamis Mushait", "Al Namas"}',
 5, false, 4.7, 67, 52),

('550e8400-e29b-41d4-a716-446655440014',
 'Eco-tourism specialist and botanist passionate about Asir''s unique flora and fauna. I lead educational nature walks, bird watching expeditions, and conservation awareness tours through the region''s pristine natural reserves.',
 '{"nature", "eco_tourism", "bird_watching", "conservation", "education"}',
 '{"Arabic", "English"}',
 7, 'approved', true,
 '{"Tanoumah", "Al Namas", "Jabal Sawda", "Raydah Reserve"}',
 10, true, 4.8, 89, 71);

-- ============================================================================
-- EXPERIENCES (What guides offer)
-- ============================================================================

INSERT INTO experiences (
    guide_id, title, description, category, duration_hours, duration_text,
    price_per_person, max_participants, min_participants, included_services,
    excluded_services, meeting_point, difficulty_level, photos, is_active
) VALUES

-- Ahmed's Mountain Adventures
('550e8400-e29b-41d4-a716-446655440010',
 'Jabal Sawda Summit Challenge',
 'Conquer Saudi Arabia''s highest peak! This challenging 6-hour trek takes you through diverse ecosystems to the summit of Jabal Sawda (3,015m). Experience breathtaking panoramic views, unique alpine vegetation, and the satisfaction of reaching the kingdom''s rooftop.',
 'adventure', 6, 'Full day',
 450, 6, 2,
 '{"professional_guide", "hiking_equipment", "safety_gear", "lunch", "transportation", "first_aid_kit", "photography_assistance"}',
 '{"personal_insurance", "hiking_boots", "water_bottle"}',
 'Jabal Sawda Cable Car Base Station', 'challenging',
 '{"https://images.unsplash.com/photo-1506905925346-21bda4d32df4", "https://images.unsplash.com/photo-1551632811-561732d1e306"}',
 true),

('550e8400-e29b-41d4-a716-446655440010',
 'Wildlife Photography Safari',
 'Capture Asir''s incredible biodiversity in this specialized photography tour. Visit Raydah Reserve and other pristine locations to photograph endemic species including the endangered Arabian leopard tracks, Asir magpies, and unique flora.',
 'adventure', 4, 'Half day',
 320, 4, 1,
 '{"photography_guide", "wildlife_expert", "telephoto_lens_rental", "transportation", "refreshments", "location_permits"}',
 '{"camera_equipment", "personal_insurance"}',
 'Raydah Reserve Visitor Center', 'moderate',
 '{"https://images.unsplash.com/photo-1549366021-9f761d040a94", "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7"}',
 true),

-- Nora's Cultural Experiences  
('550e8400-e29b-41d4-a716-446655440011',
 'Rijal Almaa Heritage Village Tour',
 'Step back in time in this UNESCO World Heritage candidate village. Explore traditional architecture, learn about ancient building techniques, and hear stories of how our ancestors lived. Experience authentic Asiri hospitality in historic surroundings.',
 'cultural', 3, '3 hours',
 180, 8, 2,
 '{"heritage_expert_guide", "village_entry_fees", "traditional_tea", "cultural_presentation", "handicraft_demonstration"}',
 '{"lunch", "transportation"}',
 'Rijal Almaa Village Main Entrance', 'easy',
 '{"https://images.unsplash.com/photo-1578662996442-48f60103fc96", "https://images.unsplash.com/photo-1571018431115-4d8f03d46bc9"}',
 true),

('550e8400-e29b-41d4-a716-446655440011',
 'Traditional Asiri Crafts Workshop',
 'Learn the ancient arts of Asiri craftsmanship! Create your own traditional basket, try pottery techniques, and learn the intricate patterns of Asiri embroidery. Take home authentic handmade souvenirs and new skills.',
 'cultural', 4, 'Half day',
 220, 6, 3,
 '{"craft_materials", "expert_instruction", "traditional_lunch", "take_home_crafts", "cultural_certificate"}',
 '{"transportation"}',
 'Khamis Mushait Heritage Center', 'easy',
 '{"https://images.unsplash.com/photo-1452860606245-08befc0ff44b", "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89"}',
 true),

-- Omar's Culinary Adventures
('550e8400-e29b-41d4-a716-446655440012',
 'Authentic Asiri Cooking Masterclass',
 'Master the art of traditional Asiri cuisine! Learn to make famous Asiri bread, prepare mountain honey specialties, and cook traditional stews using ancient recipes. Enjoy your creations in a traditional mountain setting.',
 'food', 5, '5 hours',
 280, 4, 2,
 '{"ingredients", "cooking_equipment", "recipes_booklet", "traditional_meal", "take_home_spices", "cultural_stories"}',
 '{"transportation"}',
 'Traditional Mountain Kitchen, Rijal Almaa', 'easy',
 '{"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136", "https://images.unsplash.com/photo-1551024601-bec78aea704b"}',
 true),

('550e8400-e29b-41d4-a716-446655440012',
 'Mountain Honey Farm Experience',
 'Visit authentic Asiri honey farms and learn about traditional beekeeping in the mountains. Taste various types of mountain honey, understand the beekeeping process, and discover why Asir honey is considered among the world''s finest.',
 'food', 3, '3 hours',
 195, 6, 2,
 '{"farm_tour", "honey_tasting", "beekeeping_demonstration", "honey_samples", "traditional_refreshments", "educational_materials"}',
 '{"transportation"}',
 'Al-Souda Honey Farm', 'easy',
 '{"https://images.unsplash.com/photo-1558642452-9d2a7deb7f62", "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae"}',
 true),

-- Maryam's Spiritual Journeys
('550e8400-e29b-41d4-a716-446655440013',
 'Mindful Mountain Meditation Retreat',
 'Find inner peace in the serene mountains of Asir. This spiritual journey includes guided meditation sessions, mindfulness walks through ancient paths, and reflection time at sacred mountain viewpoints. Perfect for spiritual renewal.',
 'spiritual', 4, 'Half day',
 150, 5, 1,
 '{"meditation_guide", "yoga_mats", "healthy_refreshments", "spiritual_materials", "peaceful_location_access"}',
 '{"transportation", "meals"}',
 'Asir Mountain Retreat Center', 'easy',
 '{"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"}',
 true),

-- Salem's Nature Expeditions
('550e8400-e29b-41d4-a716-446655440014',
 'Asir Endemic Flora Discovery Tour',
 'Explore the unique plant life of Asir with a professional botanist. Discover endemic species, learn about medicinal plants used by locals, and understand the ecological importance of this biodiversity hotspot.',
 'nature', 4, 'Half day',
 190, 8, 3,
 '{"botanist_guide", "field_guide_book", "magnifying_equipment", "plant_identification_sheets", "nature_refreshments", "educational_materials"}',
 '{"hiking_shoes", "transportation"}',
 'Asir National Park Visitor Center', 'moderate',
 '{"https://images.unsplash.com/photo-1441974231531-c6227db76b6e", "https://images.unsplash.com/photo-1426604966848-d7adac402bff"}',
 true),

('550e8400-e29b-41d4-a716-446655440014',
 'Birds of Asir Photography Workshop',
 'Photograph Asir''s incredible bird diversity including endemic species like the Asir magpie. Learn bird photography techniques while contributing to citizen science conservation efforts.',
 'nature', 6, 'Full day',
 350, 6, 2,
 '{"ornithologist_guide", "bird_identification_guide", "photography_tips", "telescope_access", "conservation_briefing", "lunch", "transportation"}',
 '{"camera_equipment", "telephoto_lens"}',
 'Raydah Reserve Research Station', 'moderate',
 '{"https://images.unsplash.com/photo-1549366021-9f761d040a94", "https://images.unsplash.com/photo-1520637836862-4d197d17c93a"}',
 true);

-- ============================================================================
-- SAMPLE BOOKINGS (Tourist-Guide interactions)
-- ============================================================================

INSERT INTO bookings (
    tourist_id, experience_id, guide_id, booking_date, booking_time,
    participants, total_amount, commission_amount, status, contact_phone,
    special_requests, payment_status, payment_method
) VALUES

-- Sarah books Ahmed's mountain adventure (high activity match)
('550e8400-e29b-41d4-a716-446655440001',
 (SELECT id FROM experiences WHERE title = 'Jabal Sawda Summit Challenge'),
 '550e8400-e29b-41d4-a716-446655440010',
 '2024-12-28', '06:00', 2, 900.00, 135.00, 'confirmed',
 '+966501234567', 'We are experienced hikers looking for the most challenging route. Please bring extra photography equipment.',
 'paid', 'credit_card'),

-- Mike books Nora's cultural experience  
('550e8400-e29b-41d4-a716-446655440002',
 (SELECT id FROM experiences WHERE title = 'Rijal Almaa Heritage Village Tour'), 
 '550e8400-e29b-41d4-a716-446655440011',
 '2024-12-26', '09:00', 4, 720.00, 108.00, 'confirmed',
 '+966507654321', 'International group interested in deep cultural stories and history.',
 'paid', 'paypal'),

-- Fatima books traditional crafts (perfect cultural match)
('550e8400-e29b-41d4-a716-446655440003',
 (SELECT id FROM experiences WHERE title = 'Traditional Asiri Crafts Workshop'),
 '550e8400-e29b-41d4-a716-446655440011', 
 '2024-12-30', '10:00', 1, 220.00, 33.00, 'pending',
 '+966551234567', 'Solo traveler seeking authentic learning experience. Interested in embroidery techniques.',
 'pending', 'bank_transfer'),

-- Alex books wildlife photography
('550e8400-e29b-41d4-a716-446655440004',
 (SELECT id FROM experiences WHERE title = 'Wildlife Photography Safari'),
 '550e8400-e29b-41d4-a716-446655440010',
 '2025-01-03', '05:30', 2, 640.00, 96.00, 'confirmed',
 '+966559876543', 'Professional photographer seeking unique wildlife shots for exhibition.',
 'paid', 'credit_card'),

-- Layla books cooking class (perfect food match)
('550e8400-e29b-41d4-a716-446655440005',
 (SELECT id FROM experiences WHERE title = 'Authentic Asiri Cooking Masterclass'),
 '550e8400-e29b-41d4-a716-446655440012',
 '2025-01-05', '11:00', 2, 560.00, 84.00, 'confirmed', 
 '+966554567890', 'Food blogger couple wanting to learn traditional recipes for documentation.',
 'paid', 'credit_card');

-- ============================================================================
-- SAMPLE MESSAGES (Tourist-Guide communication)
-- ============================================================================

INSERT INTO messages (from_user_id, to_user_id, content, booking_id, message_type) VALUES

-- Sarah & Ahmed conversation about mountain adventure
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010',
 'Hi Ahmed! I''m so excited about the Jabal Sawda summit hike. What''s the weather forecast looking like for our date?',
 (SELECT id FROM bookings WHERE tourist_id = '550e8400-e29b-41d4-a716-446655440001' LIMIT 1),
 'text'),

('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001',
 'Welcome Sarah! The weather looks perfect - clear skies and mild temperatures. Perfect for photography! I''ll bring extra telephoto lens equipment as requested. Make sure to bring warm layers for the summit.',
 (SELECT id FROM bookings WHERE tourist_id = '550e8400-e29b-41d4-a716-446655440001' LIMIT 1),
 'text'),

-- Mike & Nora about heritage tour
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440011',
 'Hello Nora! Our group is really looking forward to learning about Asiri culture. Do you have any recommended reading before our visit?',
 (SELECT id FROM bookings WHERE tourist_id = '550e8400-e29b-41d4-a716-446655440002' LIMIT 1),
 'text'),

('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440002', 
 'Hello Mike! I''m thrilled to share our heritage with you. I''ll prepare some special stories about the village that aren''t in guidebooks. The architecture we''ll see is over 400 years old!',
 (SELECT id FROM bookings WHERE tourist_id = '550e8400-e29b-41d4-a716-446655440002' LIMIT 1),
 'text'),

-- Layla & Omar about cooking class
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440012',
 'Hi Omar! We''re food bloggers and would love to document some of the cooking process. Is photography allowed during the class?',
 (SELECT id FROM bookings WHERE tourist_id = '550e8400-e29b-41d4-a716-446655440005' LIMIT 1),
 'text'),

('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440005',
 'Absolutely! I love sharing our culinary heritage. I''ll make sure you get great shots of the traditional bread-making process. My grandmother''s 100-year-old recipes will be perfect for your blog!',
 (SELECT id FROM bookings WHERE tourist_id = '550e8400-e29b-41d4-a716-446655440005' LIMIT 1),
 'text');

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

-- Show summary of inserted data
SELECT 
    'Sample data inserted successfully!' as message,
    (SELECT COUNT(*) FROM profiles WHERE email LIKE '%@demo.rukna%') as total_profiles,
    (SELECT COUNT(*) FROM tourist_profiles) as tourist_profiles,
    (SELECT COUNT(*) FROM guide_profiles) as guide_profiles,
    (SELECT COUNT(*) FROM experiences) as experiences,
    (SELECT COUNT(*) FROM bookings) as bookings,
    (SELECT COUNT(*) FROM messages) as messages;