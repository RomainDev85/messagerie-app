<?php

namespace App\Controller;

use App\Entity\User;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AuthController extends AbstractController
{
    // Connexion d'un utilisateur
    #[Route('/login', name: 'login')]
    public function login(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        // Recuperer les données
        $content = $request->getContent();
        $parameters = json_decode($content);

        // Recupere les données utilisateurs
        $qb = $entityManager->createQuery("SELECT u FROM App\Entity\User u WHERE u.username = :username")->setParameter('username', $parameters->username);
        $result = $qb->getResult();

        // Check toutes les erreurs possible
        $errors = [];
        if(empty($result)){
            $errors["username"] = "Aucun utilisateur possède ce pseudo.";
        }
        if(strlen($parameters->username) === 0){
            $errors["username"] = "Veuillez indiquer votre pseudo.";
        }
        if(strlen($parameters->password) === 0){
            $errors["password"] = "Veuillez indiquer votre mot de passe.";
        }

        // Si pas d'erreur check les infos utilisateurs puis crée un token
        // Si erreur: renvoi les erreurs
        if(empty($errors)){
            $user = new User();
            $user->setUsername($result[0]->getUsername());
            $userPassword = $user->setPassword($result[0]->getPassword());
            $user->setEmail($result[0]->getEmail());
            $user->setImage($result[0]->getImage());

            // Si username et password bon: Crée token
            // Sinon: renvoi l'erreur
            if($parameters->username === $result[0]->getUsername() && $passwordHasher->isPasswordValid($userPassword, $parameters->password)){

                if($result[0]->getIsVerified()){
                    $key = $this->getParameter('app.jwt_key');
                    $payload = [
                        "username" => $user->getUsername(),
                        "email" => $user->getEmail(),
                        "image" => $user->getImage(),
                        "id" => $result[0]->getId(),
                    ];
                    $jwt = JWT::encode($payload, $key, 'HS256');
                    $cookieOptions = [
                        "expires" => time() + 60*60*24*7,
                    ];
                    setcookie('jwt', $jwt, $cookieOptions);
    
                    return $this->json([
                        "success" => 'Vous êtes connecté.',
                    ]);
                } else {
                    $errors["username"] = "Veuillez verifier votre adresse email.";

                    return $this->json([
                        "errors" => $errors,
                    ]);
                }


            } else {
                $errors["password"] = "Le mot de passe n'est pas correct.";
                return $this->json([
                    "errors" => $errors
                ]);
            }
        } else {
            return $this->json([
                "errors" => $errors
            ]);
        }
    }

    // Déconnexion d'un utilisateur
    #[Route('/logout', name: 'logout')]
    public function logout(): JsonResponse
    {
        // Check si un cookie 'jwt' existe
        // Si vrai: supprime le cookie
        // Si faux: renvoi message d'erreur 
        if (isset($_COOKIE['jwt'])){
            unset($_COOKIE['jwt']); 
            setcookie('jwt', null, -1, '/'); 
            
            return $this->json([
                "success" => "Vous êtes déconnecté."
            ]);
        } else {
            return $this->json([
                "errors" => "Aucun utilisateur connecté."
            ]);
        }
    }

    // Récupere les infos de l'utilisateur connecté (Si connecté*)
    #[Route('/jwt', name: 'jwt')]
    public function jwt(): JsonResponse
    {
        // Check si un cookie 'jwt' existe
        // Si vrai: decode le jwt
        // Si faux: renvoi message d'erreur
        if (isset($_COOKIE['jwt'])){
            $key = $this->getParameter('app.jwt_key');
            $decoded = JWT::decode($_COOKIE['jwt'], new Key($key, 'HS256'));

            return $this->json([
                "jwt" => $decoded
            ]);
        } else {
            return $this->json([
                "errors" => "Aucun utilisateur connecté."
            ]);
        }
    }
}
