<h2>Nouvelle demande de contact</h2>

<p><strong>Nom :</strong> {{ $data['name'] }}</p>
<p><strong>Email :</strong> {{ $data['email'] }}</p>
<p><strong>Téléphone :</strong> {{ $data['phone'] ?? 'Non fourni' }}</p>

<p><strong>Message :</strong></p>
<p>{{ $data['message'] }}</p>
