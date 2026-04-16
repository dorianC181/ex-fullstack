import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const EditRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      ingredients: [{ value: '' }],
      servings: 4,
      countryOfOrigin: 'France',
      priceLevel: 1,
      ovenRequired: false,
      specialEquipmentRequired: false,
      exoticIngredients: false
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients"
  });

  // Charger la recette existante
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        if (res.ok) {
          const data = await res.json();
          reset({
            ...data,
            ingredients: data.ingredients.map((v: string) => ({ value: v })),
            priceLevel: String(data.priceLevel)
          });
        }
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipe();
  }, [id, reset]);

  const onSubmit = async (data: any) => {
    try {
      const formattedData = {
        ...data,
        ingredients: data.ingredients.map((i: any) => i.value).filter((i: string) => i !== ''),
        servings: Number(data.servings),
        priceLevel: Number(data.priceLevel)
      };

      const res = await fetch(`/api/recipes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
        credentials: 'include'
      });

      if (res.ok) {
        alert("Recette mise à jour !");
        navigate('/');
      } else {
        const errData = await res.json();
        setError(errData.message || "Erreur de modification");
      }
    } catch (err) {
      setError("Erreur réseau");
    }
  };

  if (isLoading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Chargement...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Modifier la recette</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nom de la recette</label>
          <input {...register('name', { required: "Le nom est requis" })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
          {errors.name && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.name.message as string}</span>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Ingrédients</label>
          {fields.map((field, index) => (
            <div key={field.id} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input 
                {...register(`ingredients.${index}.value` as const, { required: "L'ingrédient est requis" })} 
                style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd' }} 
              />
              <button type="button" onClick={() => remove(index)} style={{ padding: '0 10px', backgroundColor: '#ff7675', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>✕</button>
            </div>
          ))}
          <button type="button" onClick={() => append({ value: '' })} style={{ padding: '0.5rem 1rem', background: '#f5f6fa', border: '1px dashed #ddd', borderRadius: '8px', cursor: 'pointer', width: '100%', marginTop: '0.5rem' }}>+ Ajouter un ingrédient</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nombre de personnes</label>
            <input type="number" {...register('servings')} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Niveau de prix (1-3)</label>
            <select {...register('priceLevel')} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}>
              <option value="1">€ (Économique)</option>
              <option value="2">€€ (Moyen)</option>
              <option value="3">€€€ (Cher)</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Pays d'origine</label>
          <input {...register('countryOfOrigin')} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', background: '#f5f6fa', padding: '1rem', borderRadius: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" {...register('ovenRequired')} /> Nécessite un four
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" {...register('specialEquipmentRequired')} /> Matériel spécifique
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" {...register('exoticIngredients')} /> Ingrédients exotiques
          </label>
        </div>

        <button type="submit" style={{
          padding: '1rem',
          backgroundColor: '#0984e3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '1.1rem',
          cursor: 'pointer',
          marginTop: '1rem'
        }}>
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
};

export default EditRecipePage;
