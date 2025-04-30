<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Page non trouvée</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .top-right {
            position: absolute;
            top: 20px;
            right: 20px;
        }
        .custom-link {
            display: inline-block;
            border-radius: 4px;
            border: 1px solid #19140035;
            padding: 6px 16px;
            font-size: 0.875rem;
            line-height: 1.5;
            color: #1b1b18;
            text-decoration: none;
            margin-left: 10px;
        }
        .custom-link:hover {
            border-color: #1915014a;
        }
        .dark .custom-link {
            color: #EDEDEC;
            border-color: #3E3E3A;
        }
        .dark .custom-link:hover {
            border-color: #62605b;
        }
    </style>
</head>
<body class="bg-light d-flex align-items-center justify-content-center position-relative" style="height: 100vh;">
    <div class="top-right">
        @auth
            <a href="{{ route('dashboard') }}" class="custom-link">Dashboard</a>
        @else
            <a href="{{ route('login') }}" class="custom-link" style="border: none;">Log in</a>
            {{-- <a href="{{ route('creation') }}" class="custom-link">Register</a> --}}
        @endauth
    </div>

    <div class="text-center">
        <h1 class="display-1">404</h1>
        <p class="lead">Oups ! La page que vous cherchez n'existe pas.</p>
        <a href="{{ url('/') }}" class="btn btn-primary">Retour à l'accueil</a>
    </div>
</body>
</html>
