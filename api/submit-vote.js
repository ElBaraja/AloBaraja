// /api/submit-vote.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  const votes = req.body;

  if (!votes) {
    res.status(400).json({ error: 'No hay votos' });
    return;
  }

  const filePath = path.resolve('./votes.json');

  // Leemos el archivo actual o iniciamos un array vacío
  let allVotes = [];
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, 'utf8');
    allVotes = JSON.parse(fileData);
  }

  allVotes.push(votes);

  fs.writeFileSync(filePath, JSON.stringify(allVotes, null, 2));

  res.status(200).json({ message: 'Voto recibido con éxito' });
}
