/**
 * ========================================
 * PANIER D'ACHAT - MISE À JOUR AUTOMATIQUE DES PRIX
 * ========================================
 * 
 * Ce système calcule et met à jour automatiquement les prix totaux :
 * 
 * 1. MISE À JOUR AUTOMATIQUE LORS DES CHANGEMENTS DE QUANTITÉ :
 *    - Utilisation des boutons "+" et "-" → Recalcul immédiat
 *    - Modification directe dans l'input quantité → Recalcul à la validation
 *    - Le sous-total de l'article ET les totaux globaux sont mis à jour
 * 
 * 2. MISE À JOUR AUTOMATIQUE LORS DES SUPPRESSIONS :
 *    - Suppression d'un article → Retrait du calcul, totaux recalculés
 *    - Vidage du panier → Tous les totaux remis à zéro
 * 
 * 3. CALCUL DES PRIX :
 *    - Sous-total article = prix unitaire × quantité
 *    - Sous-total panier = somme de tous les sous-totaux articles
 *    - Taxes = 15% du sous-total panier
 *    - Total final = sous-total panier + taxes
 * 
 * Tous les prix sont mis à jour en temps réel sans rechargement de page.
 * ========================================
 */

// Articles présélectionnés dans le panier
let panier = [
    {
        id: 1,
        nom: "Laptop Dell XPS 15",
        prix: 1299.99,
        quantite: 1,
        image: "https://via.placeholder.com/100x100?text=Laptop",
        aime: false
    },
    {
        id: 2,
        nom: "Souris sans fil Logitech",
        prix: 29.99,
        quantite: 2,
        image: "https://via.placeholder.com/100x100?text=Souris",
        aime: false
    },
    {
        id: 3,
        nom: "Clavier mécanique RGB",
        prix: 89.99,
        quantite: 1,
        image: "https://via.placeholder.com/100x100?text=Clavier",
        aime: false
    },
    {
        id: 4,
        nom: "Webcam HD 1080p",
        prix: 59.99,
        quantite: 1,
        image: "https://via.placeholder.com/100x100?text=Webcam",
        aime: false
    }
];

// Fonction pour formater le prix en euros
function formaterPrix(prix) {
    return prix.toFixed(2) + " €";
}

/**
 * Calcule le sous-total d'un article (prix unitaire × quantité)
 * @param {Object} article - L'article avec ses propriétés (prix, quantite)
 * @returns {number} Le sous-total de l'article
 */
function calculerSousTotalArticle(article) {
    return article.prix * article.quantite;
}

/**
 * Calcule le sous-total de tout le panier
 * Additionne les sous-totaux de tous les articles présents dans le panier
 * @returns {number} Le sous-total total du panier
 */
function calculerSousTotalPanier() {
    return panier.reduce((total, article) => {
        return total + calculerSousTotalArticle(article);
    }, 0);
}

/**
 * Calcule les taxes (15% du sous-total)
 * @param {number} sousTotal - Le sous-total du panier
 * @returns {number} Le montant des taxes
 */
function calculerTaxes(sousTotal) {
    return sousTotal * 0.15;
}

/**
 * Calcule le total final à payer
 * Total = Sous-total + Taxes
 * @returns {number} Le total final à payer
 */
function calculerTotal() {
    const sousTotal = calculerSousTotalPanier();
    const taxes = calculerTaxes(sousTotal);
    return sousTotal + taxes;
}

/**
 * Fonction pour mettre à jour l'affichage des totaux du panier
 * Cette fonction recalcule et affiche automatiquement :
 * - Le sous-total (somme de tous les articles × leurs quantités)
 * - Les taxes (15% du sous-total)
 * - Le total final (sous-total + taxes)
 * 
 * Cette fonction est appelée automatiquement :
 * - Quand la quantité d'un article change
 * - Quand un article est supprimé
 * - Quand le panier est vidé
 */
function mettreAJourTotaux() {
    // Vérifier que les éléments DOM existent avant de les mettre à jour
    const elSousTotal = document.getElementById("sousTotal");
    const elTaxes = document.getElementById("taxes");
    const elTotal = document.getElementById("total");
    
    if (!elSousTotal || !elTaxes || !elTotal) {
        // Les éléments n'existent pas encore, on ne peut pas mettre à jour
        return;
    }
    
    // Calculer les nouveaux totaux
    const sousTotal = calculerSousTotalPanier();
    const taxes = calculerTaxes(sousTotal);
    const total = calculerTotal();
    
    // Animation de changement pour montrer que les valeurs ont été mises à jour
    [elSousTotal, elTaxes, elTotal].forEach(element => {
        element.style.transition = "color 0.3s ease";
        element.style.color = "#667eea";
        
        setTimeout(() => {
            element.style.color = "";
        }, 300);
    });
    
    // Mettre à jour l'affichage des valeurs
    elSousTotal.textContent = formaterPrix(sousTotal);
    elTaxes.textContent = formaterPrix(taxes);
    elTotal.textContent = formaterPrix(total);
}

// Fonction pour afficher un article dans le panier
function afficherArticle(article) {
    const panierArticles = document.getElementById("panierArticles");
    const sousTotalArticle = calculerSousTotalArticle(article);

    // Initialiser la propriété "aime" si elle n'existe pas
    if (article.aime === undefined) {
        article.aime = false;
    }

    const articleDiv = document.createElement("div");
    articleDiv.className = "cart-item";
    articleDiv.setAttribute("data-id", article.id);

    articleDiv.innerHTML = `
        <div class="item-image">
            <img src="${article.image}" alt="${article.nom}">
        </div>
        <div class="item-details">
            <div class="item-header">
                <h3 class="item-nom">${article.nom}</h3>
                <button class="btn-aimer ${article.aime ? 'aime' : ''}" 
                        data-id="${article.id}" 
                        title="${article.aime ? 'Ne plus aimer' : 'Aimer'}">
                    <span class="coeur-icon">${article.aime ? '❤️' : '🤍'}</span>
                </button>
            </div>
            <p class="item-prix">${formaterPrix(article.prix)}</p>
        </div>
        <div class="item-quantity">
            <button class="btn-quantity btn-decrease" data-id="${article.id}">-</button>
            <input type="number" 
                   class="quantity-input" 
                   value="${article.quantite}" 
                   min="1" 
                   data-id="${article.id}">
            <button class="btn-quantity btn-increase" data-id="${article.id}">+</button>
        </div>
        <div class="item-subtotal">
            <span class="subtotal-value">${formaterPrix(sousTotalArticle)}</span>
        </div>
        <div class="item-actions">
            <button class="btn-supprimer" data-id="${article.id}" title="Supprimer">🗑️</button>
        </div>
    `;

    panierArticles.appendChild(articleDiv);

    // Ajouter les événements pour cet article
    ajouterEvenementsArticle(articleDiv, article);
}

// Fonction pour trouver un article par son ID
function trouverArticleParId(id) {
    return panier.find(article => article.id === id);
}

/**
 * Fonction pour ajouter les événements DOM à un article
 * Cette fonction gère tous les événements interactifs :
 * - Ajustement des quantités grâce aux boutons "+" et "-"
 * - Modification directe de la quantité via l'input
 * - Suppression d'article
 * - Ajout aux favoris (bouton cœur)
 */
function ajouterEvenementsArticle(articleDiv, article) {
    const btnDecrease = articleDiv.querySelector(".btn-decrease");
    const btnIncrease = articleDiv.querySelector(".btn-increase");
    const quantityInput = articleDiv.querySelector(".quantity-input");
    const btnSupprimer = articleDiv.querySelector(".btn-supprimer");
    const btnAimer = articleDiv.querySelector(".btn-aimer");

    // ===== ÉVÉNEMENT : Diminuer la quantité avec le bouton "-" =====
    btnDecrease.addEventListener("click", () => {
        // Trouver l'article dans le panier pour avoir la référence à jour
        const articleActuel = trouverArticleParId(article.id);
        if (articleActuel && articleActuel.quantite > 1) {
            articleActuel.quantite--;
            quantityInput.value = articleActuel.quantite;
            mettreAJourArticle(articleDiv, articleActuel);
        }
    });

    // ===== ÉVÉNEMENT : Augmenter la quantité avec le bouton "+" =====
    btnIncrease.addEventListener("click", () => {
        // Trouver l'article dans le panier pour avoir la référence à jour
        const articleActuel = trouverArticleParId(article.id);
        if (articleActuel) {
            articleActuel.quantite++;
            quantityInput.value = articleActuel.quantite;
            mettreAJourArticle(articleDiv, articleActuel);
        }
    });

    // ===== ÉVÉNEMENT : Modifier la quantité via l'input directement =====
    quantityInput.addEventListener("change", (e) => {
        const nouvelleQuantite = parseInt(e.target.value) || 1;
        const articleActuel = trouverArticleParId(article.id);
        if (articleActuel) {
            if (nouvelleQuantite >= 1) {
                articleActuel.quantite = nouvelleQuantite;
                mettreAJourArticle(articleDiv, articleActuel);
            } else {
                // Si la quantité est invalide, remettre à 1
                articleActuel.quantite = 1;
                e.target.value = 1;
                mettreAJourArticle(articleDiv, articleActuel);
            }
        }
    });

    // ===== ÉVÉNEMENT : Empêcher la saisie de valeurs négatives ou nulles =====
    quantityInput.addEventListener("input", (e) => {
        let valeur = parseInt(e.target.value);
        if (isNaN(valeur) || valeur < 1) {
            e.target.value = 1;
        }
    });

    // ===== ÉVÉNEMENT : Supprimer l'article du panier (bouton 🗑️) =====
    btnSupprimer.addEventListener("click", (e) => {
        e.stopPropagation(); // Empêcher la propagation de l'événement
        supprimerArticle(article.id);
    });

    // ===== ÉVÉNEMENT : Gérer l'état "aimer" avec le bouton cœur =====
    btnAimer.addEventListener("click", (e) => {
        e.stopPropagation(); // Empêcher la propagation de l'événement
        toggleAimerArticle(article.id, articleDiv);
    });
}

/**
 * Fonction pour mettre à jour l'affichage d'un article
 * Met à jour le sous-total de l'article et recalcule les totaux globaux du panier
 * Cette fonction est appelée automatiquement quand :
 * - La quantité est modifiée avec les boutons +/-
 * - La quantité est modifiée directement dans l'input
 * 
 * @param {HTMLElement} articleDiv - L'élément DOM de l'article
 * @param {Object} article - L'objet article avec ses propriétés
 */
function mettreAJourArticle(articleDiv, article) {
    // Calculer le nouveau sous-total de l'article (prix × quantité)
    const sousTotalArticle = calculerSousTotalArticle(article);
    const subtotalValue = articleDiv.querySelector(".subtotal-value");
    
    // Mettre à jour le sous-total affiché de l'article
    if (subtotalValue) {
        // Animation visuelle pour montrer le changement
        subtotalValue.style.transition = "color 0.3s ease";
        subtotalValue.style.color = "#667eea";
        
        setTimeout(() => {
            subtotalValue.style.color = "";
        }, 300);
        
        subtotalValue.textContent = formaterPrix(sousTotalArticle);
    }
    
    // Mettre à jour automatiquement les totaux globaux du panier
    // (sous-total, taxes, total final)
    mettreAJourTotaux();
}

/**
 * Fonction pour basculer l'état "aimer" d'un article
 * Change la couleur du cœur (rouge si aimé, gris si non aimé)
 * @param {number} id - L'identifiant de l'article
 * @param {HTMLElement} articleDiv - L'élément DOM de l'article
 */
function toggleAimerArticle(id, articleDiv) {
    const article = trouverArticleParId(id);
    
    if (!article) {
        return;
    }

    // Basculer l'état "aimer"
    article.aime = !article.aime;
    
    // Trouver le bouton cœur et l'icône
    const btnAimer = articleDiv.querySelector(".btn-aimer");
    const coeurIcon = articleDiv.querySelector(".coeur-icon");
    
    if (btnAimer && coeurIcon) {
        // Animation de transition
        btnAimer.style.transform = "scale(1.2)";
        
        setTimeout(() => {
            // Changer l'icône et la classe CSS
            if (article.aime) {
                coeurIcon.textContent = "❤️";
                btnAimer.classList.add("aime");
                btnAimer.setAttribute("title", "Ne plus aimer");
                afficherMessage(`"${article.nom}" a été ajouté à vos favoris ❤️`, "success");
            } else {
                coeurIcon.textContent = "🤍";
                btnAimer.classList.remove("aime");
                btnAimer.setAttribute("title", "Aimer");
                afficherMessage(`"${article.nom}" a été retiré de vos favoris`, "info");
            }
            
            // Remettre le bouton à sa taille normale
            btnAimer.style.transform = "scale(1)";
        }, 150);
    }
}

/**
 * Fonction pour supprimer un article du panier
 * @param {number} id - L'identifiant de l'article à supprimer
 */
function supprimerArticle(id) {
    // Trouver l'article à supprimer pour afficher son nom dans la confirmation
    const articleASupprimer = trouverArticleParId(id);
    
    if (!articleASupprimer) {
        afficherMessage("Article introuvable dans le panier.", "warning");
        return;
    }

    // Demander confirmation avant de supprimer avec le nom de l'article
    const confirmation = confirm(
        `Êtes-vous sûr de vouloir supprimer "${articleASupprimer.nom}" du panier ?`
    );
    
    if (confirmation) {
        // Retirer l'article du tableau panier (important : avant la mise à jour des totaux)
        panier = panier.filter(article => article.id !== id);
        
        // Trouver et supprimer l'élément DOM correspondant
        const articleDiv = document.querySelector(`.cart-item[data-id="${id}"]`);
        if (articleDiv) {
            // Animation de suppression
            articleDiv.style.transition = "opacity 0.3s, transform 0.3s";
            articleDiv.style.opacity = "0";
            articleDiv.style.transform = "translateX(-20px)";
            
            setTimeout(() => {
                articleDiv.remove();
                // Mettre à jour les totaux APRÈS la suppression visuelle de l'élément
                mettreAJourTotaux();
            }, 300);
        } else {
            // Si l'élément DOM n'existe pas, mettre à jour immédiatement
            mettreAJourTotaux();
        }
        
        // Afficher un message de confirmation
        afficherMessage(`"${articleASupprimer.nom}" a été supprimé du panier.`, "success");
        
        // Afficher un message si le panier est maintenant vide
        if (panier.length === 0) {
            setTimeout(() => {
                afficherMessage("Votre panier est maintenant vide.", "info");
                // Réinitialiser l'affichage pour montrer le panier vide
                initialiserPanier();
            }, 500);
        }
    }
}

// Fonction pour vider le panier
function viderPanier() {
    if (panier.length === 0) {
        afficherMessage("Le panier est déjà vide.", "info");
        return;
    }

    if (confirm("Êtes-vous sûr de vouloir vider tout le panier ?")) {
        panier = [];
        document.getElementById("panierArticles").innerHTML = "";
        mettreAJourTotaux();
        afficherMessage("Le panier a été vidé avec succès.", "success");
    }
}

// Fonction pour valider la commande
function validerCommande() {
    if (panier.length === 0) {
        afficherMessage("Votre panier est vide. Veuillez ajouter des articles avant de valider.", "warning");
        return;
    }

    const total = calculerTotal();
    const message = `Commande validée avec succès !\n\nTotal à payer: ${formaterPrix(total)}\n\nNombre d'articles: ${panier.length}\n\nMerci pour votre achat !`;
    
    alert(message);
    
    // Optionnel: réinitialiser le panier après validation
    // viderPanier();
}

// Fonction pour afficher un message (optionnel, peut être améliorée avec une meilleure UI)
function afficherMessage(message, type = "info") {
    // Créer une notification temporaire
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add("show");
    }, 10);

    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Fonction pour initialiser le panier
function initialiserPanier() {
    const panierArticles = document.getElementById("panierArticles");
    
    if (panier.length === 0) {
        panierArticles.innerHTML = `
            <div class="empty-cart">
                <p>Votre panier est vide.</p>
            </div>
        `;
    } else {
        panierArticles.innerHTML = "";
        panier.forEach(article => {
            afficherArticle(article);
        });
    }
    
    mettreAJourTotaux();
}

// ========================================
// ÉVÉNEMENTS DOM GLOBAUX
// ========================================
// Tous les événements sont attachés après le chargement complet du DOM
document.addEventListener("DOMContentLoaded", () => {
    // Initialiser le panier au chargement de la page
    initialiserPanier();

    // ===== ÉVÉNEMENT : Vider le panier =====
    const btnViderPanier = document.getElementById("viderPanier");
    if (btnViderPanier) {
        btnViderPanier.addEventListener("click", viderPanier);
    }

    // ===== ÉVÉNEMENT : Valider la commande =====
    const btnValiderCommande = document.getElementById("validerCommande");
    if (btnValiderCommande) {
        btnValiderCommande.addEventListener("click", validerCommande);
    }
});
