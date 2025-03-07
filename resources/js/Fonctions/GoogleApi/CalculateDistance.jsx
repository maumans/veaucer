import axios from 'axios';

export const calculateDistance = async (origin, destination) => {
    try {
        const response = await axios.post(route("calculateDistance"), {
            origin: origin.description,
            destination: destination.description,
        });

        if (response.data.distance) {
            return response.data.distance;
        } else {
            console.error('Erreur lors du calcul de la distance:', response.data.error);
            return null;
        }
    } catch (error) {
        console.error('Erreur lors du calcul de la distance:', error);
        return null;
    }
};

// Exemple d'utilisation dans un composant React
const handleCalculateDistance = async () => {
    const distance = await calculateDistance(departure, arrival);
    if (distance) {
        setDistance(distance);
    }
};
