-- 1. First create a test user (extends auth.users)
INSERT INTO profiles (id, username, display_name, discord_id, email)
VALUES (
  '157d22df-3a54-44da-a4bb-1378d95259b4',
  'test_gm',
  'Test Game Master',
  'discord_123456',
  'test_gm@example.com'
);

-- 2. Create another test user for player role
INSERT INTO profiles (id, username, display_name, discord_id, email)
VALUES (
  'c21d82b3-0adf-48e5-ad5d-b2e7cde8d5bd',
  'test_player',
  'Test Player',
  'discord_654321',
  'test_player@example.com'
);

-- 3. Create a campaign
INSERT INTO campaigns (id, name, description, power_level, gm_id, setting_description)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'Metropolis Chronicles',
  'A superhero campaign set in a modern metropolis facing extraordinary threats',
  12,
  '157d22df-3a54-44da-a4bb-1378d95259b4',
  'Modern-day city with emerging superhuman phenomena'
);

-- 4. Add both users to the campaign
INSERT INTO campaign_members (campaign_id, user_id, role)
VALUES 
  ('33333333-3333-3333-3333-333333333333', '157d22df-3a54-44da-a4bb-1378d95259b4', 'gm'),
  ('33333333-3333-3333-3333-333333333333', 'c21d82b3-0adf-48e5-ad5d-b2e7cde8d5bd', 'player');

-- 5. Create a character for the player
INSERT INTO characters (
  id, name, player_id, campaign_id, power_points, hero_points, power_level,
  strength, stamina, agility, dexterity, fighting, intellect, awareness, presence,
  dodge, parry, fortitude, toughness, will,
  identity, description, background
)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  'Solar Flare',
  'c21d82b3-0adf-48e5-ad5d-b2e7cde8d5bd',
  '33333333-3333-3333-3333-333333333333',
  150,
  2,
  12,
  2,  -- strength
  4,  -- stamina
  6,  -- agility
  4,  -- dexterity
  8,  -- fighting
  2,  -- intellect
  4,  -- awareness
  3,  -- presence
  12, -- dodge
  10, -- parry
  8,  -- fortitude
  12, -- toughness
  8,  -- will
  'Kaelen Frost',
  'A hero who can manipulate light and heat, creating brilliant displays of solar energy',
  'Former astrophysics student who gained powers during a solar eclipse experiment'
);

-- 6. Add skills for the character
INSERT INTO character_skills (character_id, skill_name, skill_type, ability_type, ranks)
VALUES 
  ('44444444-4444-4444-4444-444444444444', 'Acrobatics', 'physical', 'agility', 4),
  ('44444444-4444-4444-4444-444444444444', 'Perception', 'perception', 'awareness', 6),
  ('44444444-4444-4444-4444-444444444444', 'Technology', 'technical', 'intellect', 2);

-- 7. Add advantages
INSERT INTO character_advantages (character_id, advantage_name, description, ranks, cost_per_rank, total_cost)
VALUES 
  ('44444444-4444-4444-4444-444444444444', 'Defensive Roll', 'Can dodge attacks more effectively', 2, 1, 2),
  ('44444444-4444-4444-4444-444444444444', 'Improved Initiative', 'React faster in combat', 1, 1, 1);

-- 8. Add complications
INSERT INTO character_complications (character_id, complication_name, description, type, frequency, intensity)
VALUES 
  (
    '44444444-4444-4444-4444-444444444444',
    'Secret Identity',
    'Must protect his identity as Kaelen Frost',
    'responsibility',
    'common',
    'moderate'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Light Sensitivity',
    'Overexposure to bright light can overwhelm his powers',
    'circumstance',
    'uncommon',
    'low'
  );

-- 9. Add powers
INSERT INTO character_powers (
  character_id, power_name, description, effect, rank, cost_per_rank, total_cost,
  action_type, duration_type, range_type, descriptors
)
VALUES 
  (
    '44444444-4444-4444-4444-444444444444',
    'Solar Blast',
    'Projects concentrated beams of solar energy',
    'Damage',
    10,
    1,
    10,
    'standard',
    'instant',
    'ranged',
    ARRAY['light', 'heat', 'energy']
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Light Form',
    'Can transform into pure light for brief periods',
    'Insubstantial',
    4,
    5,
    20,
    'move',
    'sustained',
    'personal',
    ARRAY['light', 'energy']
  );

-- 10. Add power modifiers for Solar Blast
INSERT INTO power_modifiers (power_id, modifier_name, modifier_type, cost_per_rank, description)
VALUES 
  (
    (SELECT id FROM character_powers WHERE character_id = '44444444-4444-4444-4444-444444444444' AND power_name = 'Solar Blast'),
    'Ranged',
    'extra',
    1,
    'Can attack at distance'
  ),
  (
    (SELECT id FROM character_powers WHERE character_id = '44444444-4444-4444-4444-444444444444' AND power_name = 'Solar Blast'),
    'Limited: Requires light source',
    'flaw',
    -1,
    'Power is less effective in complete darkness'
  );

-- 11. Add equipment
INSERT INTO equipment (character_id, name, description, equipment_type, cost, removable)
VALUES 
  (
    '44444444-4444-4444-4444-444444444444',
    'Solar Amplifier Gauntlets',
    'Wrist-mounted devices that help focus light energy',
    'gadget',
    10,
    true
  );

-- 12. Create an NPC for the campaign
INSERT INTO npcs (campaign_id, name, description, npc_type, character_data)
VALUES 
  (
    '33333333-3333-3333-3333-333333333333',
    'Dr. Malice',
    'Brilliant scientist turned villain with gravity manipulation technology',
    'villain',
    '{"abilities": {"strength": 2, "intellect": 10, "presence": 6}, "powers": ["Gravity Control", "Force Fields"], "defenses": {"toughness": 14, "will": 12}}'::jsonb
  );

-- 13. Create an encounter
INSERT INTO encounters (campaign_id, name, description, location, encounter_type, status)
VALUES 
  (
    '33333333-3333-3333-3333-333333333333',
    'Bank Heist Showdown',
    'Dr. Malice and his henchmen are robbing First Metropolis Bank',
    'Downtown Financial District',
    'combat',
    'planned'
  );

-- 14. Add NPC to encounter
INSERT INTO encounter_npcs (encounter_id, npc_id, initiative, conditions)
VALUES 
  (
    (SELECT id FROM encounters WHERE name = 'Bank Heist Showdown'),
    (SELECT id FROM npcs WHERE name = 'Dr. Malice'),
    18,
    ARRAY['focused']
  );