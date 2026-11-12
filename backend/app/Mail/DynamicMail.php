<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DynamicMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;
    public $viewName;
    public $mailSubject;

    // Sab kuch constructor mein pass karein
    public function __construct($data, $viewName, $mailSubject)
    {
        $this->data = $data;
        $this->viewName = $viewName;
        $this->mailSubject = $mailSubject;
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: $this->mailSubject);
    }

    public function content(): Content
    {
        return new Content(
            view: $this->viewName,
            with: ['data' => $this->data] // Data 'data' variable mein milega view ko
        );
    }
}
