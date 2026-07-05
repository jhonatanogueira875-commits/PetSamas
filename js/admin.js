import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inicialize seu cliente Supabase
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function AdminPage() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    fetchPets();
  }, []);

  async function fetchPets() {
    const { data } = await supabase.from('pets').select('id, nome_pet, nome_tutor, qr_liberado');
    setPets(data);
  }

  async function toggleStatus(id, currentStatus) {
    const { error } = await supabase
      .from('pets') // Tabela identificada
      .update({ qr_liberado: !currentStatus }) // Coluna de controle
      .eq('id', id);

    if (!error) fetchPets(); // Atualiza a lista após mudar
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold mb-4">Painel Administrativo</h1>
      {pets.map((pet) => (
        <div key={pet.id} className="bg-white p-4 mb-3 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="font-bold">{pet.nome_pet}</p>
            <p className="text-sm text-gray-600">{pet.nome_tutor}</p>
          </div>
          <button 
            onClick={() => toggleStatus(pet.id, pet.qr_liberado)}
            className={`px-4 py-2 rounded font-bold ${pet.qr_liberado ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
          >
            {pet.qr_liberado ? 'TRUE' : 'FALSE'}
          </button>
        </div>
      ))}
    </div>
  );
}