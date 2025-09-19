-- Migration para remover status CANCELLED do enum EventStatus
-- Execute este script no seu banco PostgreSQL

-- 1. Primeiro, atualizar todos os eventos com status CANCELLED para INACTIVE
UPDATE events 
SET status = 'INACTIVE' 
WHERE status = 'CANCELLED';

-- 2. Remover o valor CANCELLED do enum
-- Nota: PostgreSQL não permite remover valores de enum diretamente
-- Precisamos recriar o enum

-- 2.1. Criar um novo enum sem CANCELLED
CREATE TYPE EventStatus_new AS ENUM ('ACTIVE', 'INACTIVE');

-- 2.2. Atualizar a coluna para usar o novo enum
ALTER TABLE events 
ALTER COLUMN status TYPE EventStatus_new 
USING status::text::EventStatus_new;

-- 2.3. Remover o enum antigo
DROP TYPE EventStatus;

-- 2.4. Renomear o novo enum para o nome original
ALTER TYPE EventStatus_new RENAME TO EventStatus;

-- 3. Verificar se a migration foi aplicada corretamente
SELECT DISTINCT status FROM events;
