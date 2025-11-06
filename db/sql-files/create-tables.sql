CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  discord_id TEXT UNIQUE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  power_level INTEGER NOT NULL DEFAULT 10,
  gm_id UUID REFERENCES profiles(id) NOT NULL,
  image_url TEXT,
  setting_description TEXT,
  house_rules JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE campaign_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('gm', 'player')) DEFAULT 'player',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(campaign_id, user_id)
);

CREATE TABLE characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  player_id UUID REFERENCES profiles(id) NOT NULL,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  -- Core Stats
  power_points INTEGER DEFAULT 150,
  hero_points INTEGER DEFAULT 1,
  power_level INTEGER NOT NULL,
  -- Abilities (from SRD)
  strength INTEGER DEFAULT 0,
  stamina INTEGER DEFAULT 0,
  agility INTEGER DEFAULT 0,
  dexterity INTEGER DEFAULT 0,
  fighting INTEGER DEFAULT 0,
  intellect INTEGER DEFAULT 0,
  awareness INTEGER DEFAULT 0,
  presence INTEGER DEFAULT 0,
  -- Combat Values (from SRD)
  dodge INTEGER DEFAULT 0,
  parry INTEGER DEFAULT 0,
  fortitude INTEGER DEFAULT 0,
  toughness INTEGER DEFAULT 0,
  will INTEGER DEFAULT 0,
  -- Details
  identity TEXT,
  gender TEXT,
  age TEXT,
  height TEXT,
  weight TEXT,
  hair_color TEXT,
  eye_color TEXT,
  description TEXT,
  background TEXT,
  personality TEXT,
  quote TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE character_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  skill_type TEXT CHECK (skill_type IN ('academic', 'interaction', 'investigation', 'perception', 'physical', 'professional', 'technical', 'vehicle')) NOT NULL,
  ability_type TEXT CHECK (ability_type IN ('intellect', 'awareness', 'presence', 'agility', 'strength', 'fighting', 'dexterity')) NOT NULL,
  ranks INTEGER DEFAULT 0,
  misc_bonus INTEGER DEFAULT 0,
  UNIQUE(character_id, skill_name)
);

CREATE TABLE character_advantages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  advantage_name TEXT NOT NULL,
  description TEXT,
  ranks INTEGER DEFAULT 1,
  cost_per_rank INTEGER DEFAULT 1,
  total_cost INTEGER DEFAULT 1
);

CREATE TABLE character_complications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  complication_name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('motivation', 'enemy', 'responsibility', 'reputation', 'accident', 'circumstance', 'other')),
  frequency TEXT,
  intensity TEXT
);

CREATE TABLE character_powers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  power_name TEXT NOT NULL,
  description TEXT,
  effect TEXT NOT NULL,
  rank INTEGER DEFAULT 1,
  cost_per_rank INTEGER DEFAULT 1,
  total_cost INTEGER DEFAULT 1,
  action_type TEXT CHECK (action_type IN ('standard', 'move', 'free', 'reaction')),
  duration_type TEXT CHECK (duration_type IN ('instant', 'sustained', 'continuous', 'permanent')),
  range_type TEXT CHECK (range_type IN ('personal', 'close', 'ranged', 'perception')),
  descriptors TEXT[]
);

CREATE TABLE power_modifiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  power_id UUID REFERENCES character_powers(id) ON DELETE CASCADE,
  modifier_name TEXT NOT NULL,
  modifier_type TEXT CHECK (modifier_type IN ('extra', 'flaw')),
  cost_per_rank INTEGER DEFAULT 0,
  flat_cost INTEGER DEFAULT 0,
  description TEXT
);

CREATE TABLE equipment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  equipment_type TEXT CHECK (equipment_type IN ('gadget', 'vehicle', 'headquarters', 'other')),
  cost INTEGER DEFAULT 0,
  powers JSONB, -- Stores powers as JSON for equipment-specific powers
  removable BOOLEAN DEFAULT false,
  quantity INTEGER DEFAULT 1
);

CREATE TABLE npcs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  npc_type TEXT CHECK (npc_type IN ('minion', 'sidekick', 'villain', 'ally', 'neutral')),
  character_data JSONB, -- Full character data stored as JSON for simplicity
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE encounters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  encounter_type TEXT CHECK (encounter_type IN ('combat', 'social', 'exploration', 'challenge')),
  status TEXT CHECK (status IN ('planned', 'active', 'completed')) DEFAULT 'planned',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE encounter_npcs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  encounter_id UUID REFERENCES encounters(id) ON DELETE CASCADE,
  npc_id UUID REFERENCES npcs(id) ON DELETE CASCADE,
  initiative INTEGER DEFAULT 0,
  current_hp INTEGER,
  conditions TEXT[],
  notes TEXT,
  UNIQUE(encounter_id, npc_id)
);

-- Allow users to see campaigns they're members of
CREATE POLICY "Users can view campaigns they belong to" ON campaigns
FOR SELECT USING (
  id IN (SELECT campaign_id FROM campaign_members WHERE user_id = auth.uid())
);