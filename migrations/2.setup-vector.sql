-- Membuat function baru di dalam database supabase
CREATE OR REPLACE FUNCTION match_transactions (
    query_embedding vector(768),
    -- arti dari match_threshold adalah nilai batas bawah dari skor kemiripan, misalnya nnti di set dengan tingkat kemiripan 0.8(80%) maka tingkat kemiripan yang di atas 80%(0.8) yang akan di tampilkan
    match_threshold float,
    -- arti dari match_count ini adalah jumlah data yang ingin di kembalikan
    match_count int
)

RETURNS TABLE (
    id uuid,
    type text,
    category text,
    amount numeric,
    description text,
    date date,
    user_id uuid,
    -- arti dari similarity ini adalah, data yang di return itu hanya data yang memiliki kemiripan paling tinggi, misalnya ada 2 data yang memiliki kemiripan 0,8 dan 0,7. maka yang di return adalah 0.8
    similarity float
)

LANGUAGE sql STABLE
AS $$
  SELECT
    transactions.id,
    transactions.type,
    transactions.category,
    transactions.amount,
    transactions.description,
    transactions.date,
    transactions.user_id,
    1 - (transactions.embedding <=> query_embedding) AS similarity
  FROM transactions
  WHERE 1 - (transactions.embedding <=> query_embedding) > match_threshold
  ORDER BY transactions.embedding <=> query_embedding
  LIMIT match_count;
$$;

