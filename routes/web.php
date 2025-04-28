<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ServiceTypeController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\VenueController;



Route::fallback(function () {
    return response()->view('errors.404', [], 404);
});

// Route::fallback(function () {
//     return Inertia::render('not-found')->toResponse(request())->setStatusCode(404);
// });




// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');


// Route::get('/', function () {
//     return Inertia::render('home');
// })->name('home');

Route::get('/', [HomeController::class, 'index'])->name('home');

// Route::get('/services', function () {
//     return Inertia::render('services');
// })->name('services');



Route::get('/events', [EventController::class, 'getEvents'])->name('events');
Route::get('/events/{event}', [EventController::class, 'getEventsShow'])->name('events.show');

Route::get('/venues', [VenueController::class, 'getVenues'])->name('venues');
Route::get('/venues/{venue}', [VenueController::class, 'getVenuesShow'])->name('venues.show');

Route::get('/services', [ServiceController::class, 'getServices'])->name('services');
Route::get('/galerie', [GalleryController::class, 'getGaleries'])->name('galerie');
Route::get('/contact', [ContactController::class, 'getFaq'])->name('contact');
// Route::get('/testimonial', [TestimonialController::class, 'getTestimonial'])->name('testimonial');

Route::post('/contact-message', [ContactController::class, 'sendMessage'])->name('contact.message');

// Route::get('/galerie', function () {
//     return Inertia::render('galeries');
// })->name('galerie');

// Route::get('/contact', function () {
//     return Inertia::render('contact');
// })->name('contact');



// Route::get('/admin', function () {
//     return Inertia::render('admin');
// })->name('admin');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');


    Route::get('gallery', [GalleryController::class, 'index']);
    Route::post('gallery', [GalleryController::class, 'store']);
    Route::put('gallery/{gallery}', [GalleryController::class, 'update']);
    Route::delete('gallery/{gallery}', [GalleryController::class, 'destroy']);

    Route::resource('contact-dashboard', ContactController::class);

    Route::get('contact-infos', [ContactController::class, 'indexInfo'])->name('contact-infos.index');
    Route::post('/contact-infos', [ContactController::class, 'storeInfo'])->name('contact-infos.store');
    Route::put('/contact-infos', [ContactController::class, 'updateInfo'])->name('contact-infos.update');
    Route::delete('/contact-infos/{contact}', [ContactController::class, 'destroyInfo'])->name('contact-infos.destroy');

    Route::resource('services-dashboard', ServiceController::class);
    Route::resource('services-types', ServiceTypeController::class);
    Route::resource('testimonials-dashboard', TestimonialController::class);
    Route::resource('events-dashboard', EventController::class);
    Route::resource('venues-dashboard', VenueController::class);

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
