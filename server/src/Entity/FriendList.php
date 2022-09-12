<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * FriendList
 *
 * @ORM\Table(name="friend_list")
 * @ORM\Entity
 */
class FriendList
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var int
     *
     * @ORM\Column(name="id_user", type="integer", nullable=false)
     */
    private $idUser;

    /**
     * @var int
     *
     * @ORM\Column(name="id_friend", type="integer", nullable=false)
     */
    private $idFriend;

    /**
     * @var int
     *
     * @ORM\Column(name="status_friend", type="integer", nullable=false)
     */
    private $statusFriend;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdUser(): ?int
    {
        return $this->idUser;
    }

    public function setIdUser(int $idUser): self
    {
        $this->idUser = $idUser;

        return $this;
    }

    public function getIdFriend(): ?int
    {
        return $this->idFriend;
    }

    public function setIdFriend(int $idFriend): self
    {
        $this->idFriend = $idFriend;

        return $this;
    }

    public function getStatusFriend(): ?int
    {
        return $this->statusFriend;
    }

    public function setStatusFriend(int $statusFriend): self
    {
        $this->statusFriend = $statusFriend;

        return $this;
    }


}
