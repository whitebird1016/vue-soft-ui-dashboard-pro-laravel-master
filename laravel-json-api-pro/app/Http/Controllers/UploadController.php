<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use LaravelJsonApi\Core\Document\Error;

class UploadController extends Controller
{
    /**
     * List of allowed upload paths
     *
     * @var array
     */
    protected $allowedPaths = [
        'users' => [
            'profile-image'
        ],
        'items' => [
            'image'
        ]
    ];

    public function __construct()
    {
        $this->allowedPaths = collect($this->allowedPaths);
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(string $resource, string $id, string $field, Request $request)
    {
        // Check if path is allowed
        if ($this->routeIsAllowed($resource, $field)) {

            $request->validate([
                'attachment' => 'required|image|max:2048',
            ]);

            $path = "{$resource}/{$id}/{$field}";

            Storage::disk('public');
            // Upload the image and return the path
            $path = Storage::put($path, $request->file('attachment'));
            $url  = Storage::url($path);

            return response()->json(compact('url'), 201);
        }

        return
            Error::fromArray([
                'title' => 'Bad Request',
                'detail' => 'Not a valid path',
                'status' => '400',
            ]);
    }

    /**
     * Check if route is allowed
     *
     * @param string $resource
     * @param string $field
     * @return string|boolean
     */
    protected function routeIsAllowed(string $resource, string $field)
    {
        return $this->allowedPaths->search(function ($allowedFields, $allowedResource) use ($resource, $field) {
            return $resource == $allowedResource && in_array($field, $allowedFields);
        });
    }
}
