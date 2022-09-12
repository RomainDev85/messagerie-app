<?php

namespace App\Controller;

use App\Entity\FriendList;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;

class RelationController extends AbstractController
{
    // Ajouter un ami
    #[Route('/friend/add', name: 'add_friend')]
    public function addFriend(Request $request, EntityManagerInterface $entityManager, ManagerRegistry $doctrine): JsonResponse
    {
        $data = json_decode($request->getContent());

        // Check si les utilisateurs sont déjà amis
        $queryCheckFriend = $entityManager->createQuery("SELECT fl FROM App\Entity\FriendList fl WHERE fl.idUser = :id_user AND fl.idFriend = :id_friend")->setParameters([
            "id_user" => $data->id_user,
            "id_friend" => $data->id_friend
        ]);
        $relationFound = $queryCheckFriend->getResult();

        if(empty($relationFound)){
            // Utilisateur qui envoie une demande d'ami
            $newFriendSender = new FriendList();     
            $newFriendSender->setIdUser($data->id_user);
            $newFriendSender->setIdFriend($data->id_friend);
            $newFriendSender->setStatusFriend(2);
            
            // Utilisateur qui recoit une demande d'ami
            $newFriendReceiver = new FriendList();
            $newFriendReceiver->setIdUser($data->id_friend);
            $newFriendReceiver->setIdFriend($data->id_user);
            $newFriendReceiver->setStatusFriend(1);

            // Persiste les données en DB
            $entityManager->persist($newFriendSender);
            $entityManager->persist($newFriendReceiver);
            $entityManager->flush();

            return $this->json([
                "success" => "La demande d'ami a bien été envoyé."
            ]);
        } elseif($relationFound[0]->getStatusFriend() === 4){
            $relation = $doctrine->getRepository(FriendList::class)->findOneBy(["id" => $relationFound[0]->getId()]);
            $relation->setStatusFriend(2);
            $entityManager->flush();

            return $this->json([
                "success" => "L'ami supprimer a bien été réajouter."
            ]);
        } else {
            return $this->json([
                "errors" => "Vous êtes déjà ami avec cet utilisateur."
            ]);
        }
    }

    // Supprimer un ami 
    #[Route('/friend/delete', name: 'delete_friend')]
    public function deleteFriend(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent());

        // Modifie le status de la relation en refuser
        $queryDeleteFriend = $entityManager->createQuery("UPDATE App\Entity\FriendList fl SET fl.statusFriend = 4 WHERE fl.idUser = :id_user AND fl.idFriend = :id_friend")->setParameters([
            "id_user" => $data->id_user,
            "id_friend" => $data->id_friend
        ]);
        $queryDeleteFriend->execute();

        
        return $this->json([
            "success" => "Votre suppression d'ami a bien été pris en compte."
        ]);
    }

    // Accepter une demande d'ami 
    #[Route('/friend/accept', name: 'accept_friend')]
    public function acceptFriend(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent());

        // Modifie le status de la demande d'ami recu en accepter
        $queryAcceptFriend = $entityManager->createQuery("UPDATE App\Entity\FriendList fl SET fl.statusFriend = 2 WHERE fl.idUser = :id_user AND fl.idFriend = :id_friend")->setParameters([
            "id_user" => $data->id_user,
            "id_friend" => $data->id_friend
        ]);
        $queryAcceptFriend->execute();

        
        return $this->json([
            "success" => "L'utilisateur a bien été ajouter à votre liste d'amis."
        ]);
    }

    // Refuser une demande d'ami 
    #[Route('/friend/refuse', name: 'refuse_friend')]
    public function refuseFriend(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent());

        // Modifie le status de la demande recu en refuser
        $queryRefuseFriend = $entityManager->createQuery("UPDATE App\Entity\FriendList fl SET fl.statusFriend = 3 WHERE fl.idUser = :id_user AND fl.idFriend = :id_friend")->setParameters([
            "id_user" => $data->id_user,
            "id_friend" => $data->id_friend
        ]);
        $queryRefuseFriend->execute();

        
        return $this->json([
            "success" => "Votre refus de demande d'ami a bien été pris en compte."
        ]);
    }

    // Afficher la liste des demandes d'ami en attente
    #[Route('/friend/list/request', name: 'list_request_friend')]
    public function listRequestFriend(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        // Recupere l'id de l'utilisateur connecté
        $data = json_decode($request->getContent());

        // Requete toutes les demandes d'ami recu dans la DB par l'utilisateur possedant l'id spécifier 
        $queryListRequestFriend = $entityManager->createQuery("SELECT fl FROM App\Entity\FriendList fl INNER JOIN App\Entity\User u WITH fl.idUser = u.id WHERE fl.idUser = :id_user AND fl.statusFriend = 1")
                                                ->setParameter("id_user", $data->id_user);
        $queryResponse = $queryListRequestFriend->getResult();

        
        $listRequestFriend = [];
        // Pour chaque demande d'ami recu
        foreach($queryResponse as $friendRequest){
            // Requete le 'username' et 'image' grace a l'id de l'utilisateur
            $queryUsername = $entityManager->createQuery("SELECT u.username, u.image FROM App\Entity\User u WHERE u.id = :id_user")->setParameter("id_user", $friendRequest->getIdFriend());
            $user = $queryUsername->getResult();

            // Crée en array contenant les infos utilisateurs
            $friendReq = [];
            $friendReq["username"] = $user[0]["username"];
            $friendReq["image"] = $user[0]["image"];
            $friendReq["idUser"] = $friendRequest->getIdFriend();
            $friendReq["statusRelation"] = $friendRequest->getStatusFriend();

            // Push le tableau contenant les infos utilisateur dans le tableau ListRequestFriend
            $listRequestFriend[] = $friendReq;
        }


        // Renvoi la liste des utilisateurs aillant envoyer une demande d'ami
        return $this->json([
            "list" => $listRequestFriend
        ]);
    }

    // Afficher la liste d'amis
    #[Route('/friend/list', name: 'list_friend')]
    public function listFriend(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        // Recupere l'id de l'utilisateur connecté
        $data = json_decode($request->getContent());

        // Requete tout les amis dans la DB de l'utilisateur possedant l'id spécifier 
        $queryListFriend = $entityManager->createQuery("SELECT fl FROM App\Entity\FriendList fl INNER JOIN App\Entity\User u WITH fl.idUser = u.id WHERE fl.idUser = :id_user AND fl.statusFriend = 2")
                                                ->setParameter("id_user", $data->id_user);
        $queryResponse = $queryListFriend->getResult();

        
        $listFriend = [];
        // Pour chaque demande d'ami recu
        foreach($queryResponse as $friend){
            // Requete le 'username' et 'image' grace a l'id de l'utilisateur
            $queryUsername = $entityManager->createQuery("SELECT u.username, u.image FROM App\Entity\User u WHERE u.id = :id_user")->setParameter("id_user", $friend->getIdFriend());
            $user = $queryUsername->getResult();

            // Crée en array contenant les infos utilisateurs
            $friendArray = [];
            $friendArray["username"] = $user[0]["username"];
            $friendArray["image"] = $user[0]["image"];
            $friendArray["idUser"] = $friend->getIdFriend();
            $friendArray["statusRelation"] = $friend->getStatusFriend();

            // Push le tableau contenant les infos utilisateur dans le tableau ListRequestFriend
            $listFriend[] = $friendArray;
        }


        // Renvoi la liste d'amis
        return $this->json([
            "list" => $listFriend
        ]);
    }

    // Afficher la liste des utilisateurs a rechercher
    #[Route('/friend/search', name: 'search_friend')]
    public function searchFriend(Request $request, EntityManagerInterface $entityManager, ManagerRegistry $doctrine): JsonResponse
    {
        // Recupere les données
        $content = json_decode($request->getContent());
        $username = $content->username;
        $id_user = $content->id;

        $users = [];
        $requestUsers = $doctrine->getRepository(User::class)->findAll();
        
        foreach($requestUsers as $user){
            // Dans tout les utilisateurs, recherche si le username rechercher est contenu dans le username de chaque utilisateur
            if(str_contains(strtolower($user->getUsername()), strtolower($username))){
                // Recherche dans la liste d'amis de l'utilisateur connecter, si l'utilisateur est un ami ou non
                $userFriend = $entityManager->createQuery("SELECT u.username, u.id FROM App\Entity\User u INNER JOIN App\Entity\FriendList fl WITH fl.idFriend = u.id WHERE fl.idUser = :id_user AND fl.idFriend = :id_friend")
                ->setParameters([
                    "id_user" => $id_user,
                    "id_friend" => $user->getId()
                ])
                ->getResult();

                // Si l'utilisateur est un ami la var $friend est true sinon false
                $friend = null;
                if(!empty($userFriend)){
                    $friend = true;
                } else {
                    $friend = false;
                }

                // Pousse l'utilisateur en cours de bouclage dans le tableau $users
                $users[] = [
                    'id' => $user->getId(),
                    'image' => $user->getImage(),
                    'username' => strtolower($user->getUsername()),
                    'friend_status' => $friend,
                ];
            }
        }

        return $this->json([
            'users' => $users
        ]);
    }
}
