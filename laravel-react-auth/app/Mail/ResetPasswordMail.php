<?php
// app/Mail/ResetPasswordMail.php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use SerializesModels;

    public $resetLink;

    public function __construct($resetLink)
    {
        $this->resetLink = $resetLink;
    }

    public function build()
    {
        return $this->subject('Password Reset Link')
        ->html(
            '<h2>Password Reset Request</h2>
             <p>We received a request to reset your password. Click the link below to reset your password:</p>
             <p><a href="' . $this->resetLink . '" target="_blank">Reset Password</a></p>
             <p>If you did not request a password reset, please ignore this email.</p>'
        );
    }
}
