

const { Octokit } = require('@octokit/rest');

// ⚠️ Ces valeurs doivent être stockées dans les variables d'environnement de Vercel
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER;   // 
const REPO_NAME = process.env.REPO_NAME;    // 
const FILE_PATH = 'visitors.json';          // 

const octokit = new Octokit({ auth: GITHUB_TOKEN });

module.exports = async (req, res) => {
  // N'accepter que les POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const visitorData = req.body;

  try {
    // Récupérer le fichier existant (s'il existe) pour ne pas écraser les données
    let existingContent = [];
    try {
      const { data } = await octokit.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: FILE_PATH,
      });
      // Le contenu est encodé en base64
      const content = Buffer.from(data.content, 'base64').toString('utf8');
      existingContent = JSON.parse(content);
    } catch (err) {
      // Le fichier n'##
    }

    // Ajouter la nouvelle visite
    existingContent.push(visitorData);

    // Préparer €€€€€€€
    const newContentBase64 = Buffer.from(JSON.stringify(existingContent, null, 2)).toString('base64');

    // Commit dans le dépôt
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: FILE_PATH,
      message: `New visitor from ${visitorData.ip}`,
      content: newContentBase64,
      // Si le fichier existait, il faut récupérer son sha pour le mettre à jour
      ...(data && { sha: data.sha }),
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Commit failed' });
  }
};
