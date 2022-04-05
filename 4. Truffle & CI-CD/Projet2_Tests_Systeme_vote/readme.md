## ⚡️ Projet - Système de vote 2
### Projet \#2 Enoncé
Oui oui, nous allons repartir du défi "Système de vote" !
Depuis la dernière version, vous avez vu la partie CI/CD avec les tests et le déploiement.
Vous devez alors fournir les tests unitaires de votre smart contract Nous n’attendons pas une couverture à 100% du smart contract mais veillez à bien tester les différentes possibilités de retours (event, revert).

---
Il ya 6 catégories qui vont tester chacune un ensemble de fonctionnalités.

  ### 1. WORKFLOW STATUS CHANGE TESTS, STATUS ONLY
 Je commence par tester les fonctions de changement de status car elles n'utilisent pas d'autres fonctions du voting. Au début du bloc, un before créer une instance qui sera utilisée par chaque "it" car il faut garder l'historique pour passer d'un status au suivant.

Je vérifie d'abord que le status initial est `RegisteringVoters`.
Puis pour chacune des 5 fonctions de status ce qui est vérifié est: 
 - le status demandé correspond au suivant dans l'enum
 - l'appelant de la fonction est le "owner"
 - le changement de status est bien enregistré
 
 ### 2. WORKFLOW STATUS CHANGE TESTS, EVENTS ONLY
 Cette catégorie concerne aussi les changements de status, mais ici on teste les events qui doivent être émis lors d'un changement de status. Comme précédemment on utilise la même instance du voting dans tous les "it" pour garder le fil de changement de status. Pour faire plus simple, les status sont téstés avec leur valeur numérique `new BN(x)`. Il y a un test par fonction pour vérifier l'event émis en utilisant `expectEvent`.
 
 ### 3.  REGISTRATION TESTS
  
 Cette catégorie teste la phase d'enregistrement d'adresses en tant que voters. Un beforeEach en début du bloc crée une nouvelle instance pour chaque "it".
 - Test1: Vérifie  l'enregistrement d'un voter: fonctions `addVoter` et `getVoter` utilisées, il y a 2 expects car les 2 informations concerne un même voter enregistré
 - Test2: Sur 3 comptes ajoutés, vérifie qu'1 compte est passé de `isRegistered == false` à `isRegistered == true`
 - Test3 : revert si on essaye d'enregistrer une 2e fois un voter
 - Test4: vérifie l'émission d'un event lors de l'enregistrement d'un voter
 - Test5: revert si l'enregistrement se fait en dehors du status RegisteringVoters

 
 ### 4. PROPOSAL SESSION TESTS
  Cette catégorie teste la phase d'enregistrement des propositions des voters. Un `beforeEach` en début du bloc crée une nouvelle instance pour chaque "it" avec un voter prédéfini et le status paramétré à `ProposalsRegistrationStarted`pour être dans la bonne session. Ce qui est testé est:
  

 - L'enregitrement d'un vote avec `addProposal`, et `getOneProposal` pour vérifier
 - L'ajout de plusieurs votes, et vérification de l'un d'entre eux
 - Revert si la proposition est vide
 - Revert si une adresse qui n'est pas enregistré commer "voter" essaye d'ajouter une proposition
 - L'émission d'un event `ProposalRegistered` lors de l'enregistrement d'une proposition
 - Revert si l'enregistrement se fait en dehors du status `ProposalsRegistrationStarted`

  
 ### 5. VOTE SESSION TESTS
Cette catégorie teste la session de vote des propositions. Un `beforeEach` en début du bloc crée une nouvelle instance pour chaque "it" avec un voter et 3 propositions prédéfinis, et le status paramétré à `VotingSessionStarted`pour être dans la bonne session pour voter. Ce qui est testé est:

 - L'enregistrement d'un vote : vérification de `votedProposalId`, `hasVoted` sur le voter et  `voteCount` sur la proposition concernée.
 - L'émission d'un event `Voted` lors de l'enregistrement d'un vote
 - Revert si l'enregistrement se fait en dehors du status `VotingSessionStarted`
 - Revert si un voter essaye de voter une 2eme fois
 - Revert si un voter vote pour une proposition inexistante (indice en dehors du tableau)
 - Revert si une adresse non enregistré en tant que "voter" essaye de voter 

 ### 6. TALLY VOTES TESTS
Cette catégorie teste le comptage des votes et la déclaration de la proposition gagnante. Un `beforeEach` en début du bloc crée une nouvelle instance pour chaque "it" avec 3 voters et 5 propositions prédéfinis, et le status paramétré à `VotingSessionStarted`. Ce qui est testé est:

 - La vérification de l'élément `winningProposalID` et de la proposition correspondante s'il n'ya eu aucun vote => l'ID et le `voteCount` doivent être à 0.
 - L'ajout de votes et la vérification que celle qui a plus de vote gagne

  


