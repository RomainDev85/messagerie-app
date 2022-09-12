<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mailer\MailerInterface;
use Doctrine\ORM\EntityManagerInterface;

class UserController extends AbstractController
{
    // Recupere la liste de tout les utilisateurs
    #[Route('/user/find', name: 'find_all_user')]
    public function showAllUsers(Request $request, ManagerRegistry $doctrine, EntityManagerInterface $entityManager): JsonResponse
    {
        // Recupere les données
        $content = json_decode($request->getContent());
        $id_user = $content->id;

        $users = [];
        $requestUsers = $doctrine->getRepository(User::class)->findAll();

        foreach($requestUsers as $user){
            // Recherche dans la liste d'amis de l'utilisateur connecter, si l'utilisateur est un ami ou non
            $userFriend = $entityManager->createQuery("SELECT u.username, u.id FROM App\Entity\User u INNER JOIN App\Entity\FriendList fl WITH fl.idFriend = u.id WHERE fl.idUser = :id_user AND fl.idFriend = :id_friend AND fl.statusFriend = 2")
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

            $users[] = [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
                'image' => $user->getImage(),
                'friend' => $friend,
            ];
        }


        return $this->json([
            'users' => $users
        ]);
    }

    // Crée un utilisateur
    #[Route('/user/create', name: 'create_user')]
    public function createUser(ManagerRegistry $doctrine, Request $request, UserPasswordHasherInterface $passwordHasher, MailerInterface $mailer): JsonResponse
    {
        $entityManager = $doctrine->getManager();

        // Recupere les données utilisateurs
        $username = $request->get('username');
        $email = $request->get('email');
        $password = $request->get('password');
        $validPassword = $request->get('validPassword');
        $image = $request->files->get('image');
        $dataContainImage = null;
        if($image !== null){ 
            $imageName = $request->files->get('image')->getClientOriginalName();
            $dataContainImage = true;
        } else {
            $dataContainImage = false;
        }

        // Check si toutes les données sont valides
        $errors = [];
        $checkUsername = $doctrine->getRepository(User::class)->findOneBy(["username" => $username]);
        $checkEmail = $doctrine->getRepository(User::class)->findOneBy(["email" => $email]);
        if($username === null || strlen($username) < 3 ){
            $errors["username"] = "Le pseudo doit faire au moins 3 caractères.";
        }
        if($checkUsername){
            $errors["username"] = "Le pseudo est déjà utilisé.";
        }
        if(!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) < 3 || $email === null){
            $errors["email"] = "L'email n'est pas valide.";
        }
        if($checkEmail){
            $errors["email"] = "L'email est déjà utilisé.";
        }
        if(strlen($password) < 3 || null){
            $errors["password"] = "Le mot de passe doit contenir au moins 3 caractères.";
        }
        if($password !== $validPassword){
            $errors["validPassword"] = "Les mots de passe ne sont pas identiques.";
        }
        if($dataContainImage){
            if(round(filesize($image) / 1024 / 1024, 2) > 5){
                $errors["image"] = "L'image ne doit pas dépasser 5Mo.";
            }
            if(!in_array($image->getClientOriginalExtension(), array('jpg', 'png', 'jpeg', 'webp'))){
                $errors["image"] = "L'image n'est pas à un format autorisé.";
            }
        }


        if(!empty($errors)){
            return $this->json([
                "errors" => $errors
            ]);
        } else {
            // Crée l'Objet User            
            $user = new User();
            $user->setUsername($username);
            $user->setEmail($email);
            $hashedPassword = $passwordHasher->hashPassword($user, $password);
            $user->setPassword($hashedPassword);

            // Si une image est envoyé
            if($dataContainImage){
                // Créé un nom d'image unique
                $imageExtension = $image->getClientOriginalExtension();
                $imageName = explode("." . $image->getClientOriginalExtension(), $image->getClientOriginalName())[0];
                $imageFullName = $imageName . "-" . uniqid() . "." . $imageExtension;

                // Ajoute l'image a l'Object User
                $user->setImage($imageFullName);

                // Envoi l'image dans le dossier image/client pour être afficher en front
                $destination = $this->getParameter('kernel.project_dir').'/../client/public/images/users';
                $image->move($destination, $imageFullName);
            }

            // Persiste les données dans la DB
            $entityManager->persist($user);
            $entityManager->flush();

            // Envoyer un mail pour confirmer l'adresse email
            $urlClient = $this->getParameter('app.client_url');
            $userId = $user->getId();
            $email = (new Email())
                ->from('romainaubrydev85@gmail.com')
                ->to($user->getEmail())
                ->subject('Inscription a la messagerie de Romain Aubry')
                ->html(
                    "<p>Bienvenue sur la messagerie de Romain Aubry, pour pouvoir vous connectez sur votre profil, veuillez confirmer votre adresse E-mail!</p><a href='$urlClient/confirmation/email/$userId'>Confirmez votre adresse</a>"
                );

            $mailer->send($email);


            return $this->json([
                "success" => "Vous êtes inscrit, veuillez verifier votre adresse e-mail pour vous connectez.",
            ]);
        }
    }

    // Recherche un utilisateur par son 'username'
    #[Route('/user/find/{name}', name: 'find_one_user')]
    public function showUser(ManagerRegistry $doctrine, string $name): JsonResponse
    {
        $user = $doctrine->getRepository(User::class)->findOneBy(['username' => $name]);

        if (!$user) {
            return $this->json([
                "user" => [
                    "errors" => "L'utilisateur n'existe pas."
                ]
            ]);
        } else {
            return $this->json([
                "user" => [
                    "username" => $user->getUsername(),
                    "email" => $user->getEmail()
                ]
            ]);
        };
    }

    // Modifie l'image de profil de l'utilisateur
    #[Route('/user/update/image', name: 'user_update_image')]
    public function updateImg(ManagerRegistry $doctrine, Request $request): JsonResponse
    {
        $entityManager = $doctrine->getManager();

        // Recupere les données utilisateurs
        $idUser = $request->get('id');
        $image = $request->files->get('image');
        $jwt = $request->get('jwt');

        // Check les erreurs possibles
        $errors = [];
        $user = $doctrine->getRepository(User::class)->findOneBy(["id" => $idUser]);
        if($image === null){
            $errors["image"] = "Aucune image n'a été envoyé.";
        }
        if(round(filesize($image) / 1024 / 1024, 2) > 5){
            $errors["image"] = "L'image ne doit pas dépasser 5Mo.";
        }
        if(!in_array($image->getClientOriginalExtension(), array('jpg', 'png', 'jpeg', 'webp'))){
            $errors["image"] = "L'image n'est pas à un format autorisé.";
        }
        if(!$user){
            $errors["id"] = "Aucun utilisateur ne possède cet id.";
        }

        // Si une erreur est trouver: renvoi les erreurs
        // Sinon: Modifie l'image de l'utilisateur
        if(!empty($errors)){
            return $this->json([
                "errors" => $errors
            ]);
        } else {
            // Créé un nom d'image unique
            $imageExtension = $image->getClientOriginalExtension();
            $imageName = explode("." . $image->getClientOriginalExtension(), $image->getClientOriginalName())[0];
            $imageFullName = $imageName . "-" . uniqid() . "." . $imageExtension;

            // Envoi l'image dans le dossier image/client pour être afficher en front
            $destination = $this->getParameter('kernel.project_dir').'/../client/public/images/users';
            $image->move($destination, $imageFullName);

            // Modifie l'image de l'utilisateur
            $user->setImage($imageFullName);
            $entityManager->flush();

            // Crée un nouveau JWT
            $key = $this->getParameter('app.jwt_key');
            $decoded = JWT::decode($jwt, new Key($key, 'HS256'));

            $payload = [
                "username" => $decoded->username,
                "email" => $decoded->email,
                "image" => $imageFullName,
                "id" => $decoded->id,
            ];
            $newJwt = JWT::encode($payload, $key, 'HS256');


            return $this->json([
                "success" => "L'image a bien été modifié.",
                "image" => $imageFullName,
                "newJwt" => $newJwt,
            ]);
        }
    }

    // Modifie l'username de l'utilisateur
    #[Route('/user/update/username', name: 'user_update_username')]
    public function updateUsername(ManagerRegistry $doctrine, Request $request): JsonResponse
    {
        $entityManager = $doctrine->getManager();

        // Recupere les données utilisateurs
        $content = json_decode($request->getContent());
        $idUser = $content->id;
        $username = $content->username;
        $jwt = $content->jwt;
        
        // Recherche l'utilisateur a modifié en DB
        $user = $doctrine->getRepository(User::class)->findOneBy(["id" => $idUser]);

        // Check les erreurs possibles
        $errors = [];
        if(strlen($username) < 3){
            $errors["username"] = "Le pseudo doit contenir au moins 3 caractères.";
        }
        if(!$user){
            $errors["id"] = "Aucun utilisateur ne possède cet id.";
        }

        // Si une erreur est trouver: renvoi les erreurs
        // Sinon: Modifie l'image de l'utilisateur
        if(!empty($errors)){
            return $this->json([
                "errors" => $errors
            ]);
        } else {      
            // Modifie le pseudo de l'utilisateur
            $user->setUsername($username);
            $entityManager->flush();

            // Crée un nouveau JWT
            $key = $this->getParameter('app.jwt_key');
            $decoded = JWT::decode($jwt, new Key($key, 'HS256'));

            $payload = [
                "username" => $username,
                "email" => $decoded->email,
                "image" => $decoded->image,
                "id" => $decoded->id,
            ];
            $newJwt = JWT::encode($payload, $key, 'HS256');


            return $this->json([
                "success" => "Le pseudo a bien été modifié.",
                "username" => $username,
                "newJwt" => $newJwt
            ]);
        }
    }

    // Verifier l'adresse email
    #[Route('/user/verify/email/{id}', name: 'user_verify_email')]
    public function verifyEmail(ManagerRegistry $doctrine, int $id): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $user = $doctrine->getRepository(User::class)->findOneBy(["id" => $id]);

        $user->setIsVerified(true);
        $entityManager->flush();

        return $this->json([
            "success" => "Votre adresse e-mail a bien été confirmer.",
        ]);
    }
}
