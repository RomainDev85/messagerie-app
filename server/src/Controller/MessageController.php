<?php

namespace App\Controller;

use DateTime;
use DateTimeZone;
use App\Entity\Message;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class MessageController extends AbstractController
{
    // Crée un message
    #[Route('/message/create', name: 'create_message')]
    public function createMessage(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent());

        // Check si des erreurs existent
        $errors = [];
        if(strlen($data->content) < 1){
            $errors["content"] = "Le message doit contenir au moins 1 caractère.";
        }

        // Si des erreurs sont trouvés: Renvoi les erreurs
        // Sinon: Crée le message
        if(!empty($errors)){
            return $this->json([
                "errors" => $errors
            ]);
        } else {
            // Crée l'Objet Message
            $message = new Message();
            $message->setContent($data->content);
            $message->setIdUserSender($data->id_user_sender);
            $message->setIdUserReceiver($data->id_user_receiver);
            $message->setDate(new DateTime("now", new DateTimeZone('Europe/Paris')));
            $message->setReadStatus(false);
            $message->setSendingStatus(true);

            // Persiste les données en DB
            $entityManager->persist($message);
            $entityManager->flush();
            
            // Renvoi un message de confirmation
            return $this->json([
                'success' => "Le message a bien été envoyer."
            ]);
        }


    }

    // Recuperer tout les messages entre 2 utilisateurs
    #[Route('/message/find/{idUserConnected}/{idUserFriend}', name: 'get_messages')]
    public function getMessages(ManagerRegistry $doctrine, int $idUserConnected, int $idUserFriend): JsonResponse
    {
        $messages = [];
        $messagesSend = $doctrine->getRepository(Message::class)->findBy([
            'idUserSender' => $idUserConnected,
            'idUserReceiver' => $idUserFriend
        ]);
        $messagesReceive = $doctrine->getRepository(Message::class)->findBy([
            'idUserSender' => $idUserFriend,
            'idUserReceiver' => $idUserConnected
        ]);
        
        foreach($messagesSend as $message){
            $messageSend = [
                "idMessage" => $message->getId(),
                "idUserSend" => $message->getIdUserSender(),
                "idUserReceiver" => $message->getIdUserReceiver(),
                "content" => $message->getContent(),
                "date" => $message->getDate(),
                "readStatus" => $message->isReadStatus(),
                "sendingStatus" => $message->isSendingStatus()
            ];
            $messages[] = $messageSend;
            
        };
        foreach($messagesReceive as $message){
            $messageReceive = [
                "idMessage" => $message->getId(),
                "idUserSend" => $message->getIdUserSender(),
                "idUserReceiver" => $message->getIdUserReceiver(),
                "content" => $message->getContent(),
                "date" => $message->getDate(),
                "readStatus" => $message->isReadStatus(),
                "sendingStatus" => $message->isSendingStatus()
            ];
            $messages[] = $messageReceive;
        };

        // dd($messages);
        
        // Renvoi les messages
        return $this->json([
            'messages' => $messages
        ]);

    }
}
