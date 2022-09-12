<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Message
 *
 * @ORM\Table(name="message")
 * @ORM\Entity
 */
class Message
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
     * @var string
     *
     * @ORM\Column(name="content", type="text", length=0, nullable=false)
     */
    private $content;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date", type="datetime", nullable=false)
     */
    private $date;

    /**
     * @var int
     *
     * @ORM\Column(name="id_user_sender", type="integer", nullable=false)
     */
    private $idUserSender;

    /**
     * @var int
     *
     * @ORM\Column(name="id_user_receiver", type="integer", nullable=false)
     */
    private $idUserReceiver;

    /**
     * @var bool
     *
     * @ORM\Column(name="read_status", type="boolean", nullable=false)
     */
    private $readStatus = '0';

    /**
     * @var bool|null
     *
     * @ORM\Column(name="sending_status", type="boolean", nullable=true)
     */
    private $sendingStatus = '0';

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getIdUserSender(): ?int
    {
        return $this->idUserSender;
    }

    public function setIdUserSender(int $idUserSender): self
    {
        $this->idUserSender = $idUserSender;

        return $this;
    }

    public function getIdUserReceiver(): ?int
    {
        return $this->idUserReceiver;
    }

    public function setIdUserReceiver(int $idUserReceiver): self
    {
        $this->idUserReceiver = $idUserReceiver;

        return $this;
    }

    public function isReadStatus(): ?bool
    {
        return $this->readStatus;
    }

    public function setReadStatus(bool $readStatus): self
    {
        $this->readStatus = $readStatus;

        return $this;
    }

    public function isSendingStatus(): ?bool
    {
        return $this->sendingStatus;
    }

    public function setSendingStatus(?bool $sendingStatus): self
    {
        $this->sendingStatus = $sendingStatus;

        return $this;
    }


}
